import { ImageRepository } from "./imageRepository.ts";
import { ForCreate, ForUpdate, WithTimestamp } from "../entity/utils.ts";
import { Image, imageConverter } from "../entity/imageType.ts";
import {
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { FirestoreClientManager } from "./shared/firestoreClientManager.ts";
import { injectable } from "tsyringe";
import { Query } from "@firebase/firestore";

@injectable()
export class ImageRepositoryImpl implements ImageRepository {
  private readonly colRef = (uid: string) =>
    collection(db, `users/${uid}/image`).withConverter(imageConverter);
  private readonly docRef = (uid: string, docId: string) =>
    doc(db, `users/${uid}/image/${docId}`).withConverter(imageConverter);

  private readonly clientManager = FirestoreClientManager.INSTANCE;

  async create({
    id,
    image,
  }: {
    id: string;
    image: ForCreate<Image>;
  }): Promise<Image> {
    try {
      const ref = doc(this.colRef(id));
      // const { path, filename } = await this.generatePathAndFilename(
      //   id,
      //   document.title
      // );

      const data: Image = {
        ...image,
        id: ref.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await this.clientManager.getClient().set(ref, data);

      return data;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async get({
    uid,
    imageId
  }: {
    uid: string;
    imageId: string;
  }): Promise<Image | null> {
    try {
      const snapshot = await this.clientManager
        .getClient()
        .get(this.docRef(uid, imageId));
      return snapshot.data() ?? null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getMany({
    uid,
    parentId
  }: {
    uid: string;
    parentId?: string;
  }): Promise<Document[]> {
    try {
      let q: Query<Document> = this.colRef(uid);
      if (parentId) {
        const parentDoc = await this.get({ uid, documentId: parentId });
        if (parentDoc) {
          q = query(
            q,
            where("path", "==", `${parentDoc.path}/${parentDoc.id}`)
          );
        }
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async update({
    uid,
    document
  }: {
    uid: string;
    document: ForUpdate<Document>;
  }): Promise<Document> {
    try {
      const ref = this.docRef(uid, document.id);
      await this.clientManager.getClient().update(ref, {
        ...document,
        updated_at: serverTimestamp()
      });

      const snapshot = await this.clientManager.getClient().get(ref);
      const result = snapshot.data();

      if (result === undefined) {
        return Promise.reject(new Error("Document not found"));
      }

      return this.convertTimestamps(result);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async delete({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Document> {
    try {
      const ref = this.docRef(uid, documentId);
      await this.clientManager.getClient().update(ref, {
        updated_at: serverTimestamp(),
        deleted_at: serverTimestamp()
      });

      const snapshot = await this.clientManager.getClient().get(ref);
      const result = snapshot.data();

      if (result === undefined) {
        return Promise.reject(new Error("Document not found"));
      }

      return this.convertTimestamps(result);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async move({
    uid,
    documentId,
    newParentId
  }: {
    uid: string;
    documentId: string;
    newParentId: string | null;
  }): Promise<Document> {
    try {
      const docToMove = await this.get({ uid, documentId });
      if (!docToMove) {
        throw new Error("Document not found");
      }

      const { path, filename } = await this.generatePathAndFilename(
        uid,
        docToMove.title,
        newParentId || undefined
      );

      const updatedDoc = await this.update({
        uid,
        document: {
          id: documentId,
          path,
          filename
        }
      });

      await this.updateChildDocuments(uid, documentId, path);

      return updatedDoc;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getPath({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<string> {
    try {
      const doc = await this.get({ uid, documentId });
      if (!doc) {
        throw new Error("Document not found");
      }
      return doc.filename ?? "";
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private async generatePathAndFilename(
    uid: string,
    title: string,
  ): Promise<{ path: string; filename: string }> {
    return { path: title, filename: title };
  }

  private async updateChildDocuments(
    uid: string,
    parentId: string,
    parentPath: string
  ): Promise<void> {
    const childDocs = await this.getMany({ uid, parentId });
    for (const childDoc of childDocs) {
      await this.update({
        uid,
        document: {
          id: childDoc.id,
          path: `${parentPath}/${childDoc.id}`,
          filename: `${parentPath}/${childDoc.title}`
        }
      });
    }
  }

}
