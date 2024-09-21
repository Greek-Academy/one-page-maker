import { DocumentRepository } from "./documentRepository.ts";
import { ForCreate, ForUpdate, WithTimestamp } from "../entity/utils.ts";
import { Document, documentConverter } from "../entity/documentType.ts";
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
export class DocumentRepositoryImpl implements DocumentRepository {
  private readonly colRef = (uid: string) =>
    collection(db, `users/${uid}/documents`).withConverter(documentConverter);
  private readonly docRef = (uid: string, docId: string) =>
    doc(db, `users/${uid}/documents/${docId}`).withConverter(documentConverter);

  private readonly clientManager = FirestoreClientManager.INSTANCE;

  async create({
    uid,
    document,
    parentId
  }: {
    uid: string;
    document: ForCreate<Document>;
    parentId?: string;
  }): Promise<Document> {
    try {
      const ref = doc(this.colRef(uid));
      let path = ref.id;
      let filename = document.title;

      if (parentId) {
        const parentDoc = await this.get({ uid, documentId: parentId });
        if (parentDoc) {
          path = `${parentDoc.path}/${ref.id}`;
          filename = `${parentDoc.filename}/${document.title}`;
        }
      }

      const data: WithTimestamp<Document> = {
        ...document,
        id: ref.id,
        path,
        filename,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        deleted_at: null,
        published_at: document.published_at ?? null
      };
      await this.clientManager.getClient().set(ref, data);

      return {
        ...data,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        deleted_at: null,
        published_at: document.published_at ?? null
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async get({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Document | null> {
    try {
      const snapshot = await this.clientManager
        .getClient()
        .get(this.docRef(uid, documentId));
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

      return {
        ...result,
        updated_at: Timestamp.now()
      };
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

      return result;
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

      let newPath = documentId;
      let newFilename = docToMove.title;

      if (newParentId) {
        const newParent = await this.get({ uid, documentId: newParentId });
        if (newParent) {
          newPath = `${newParent.path}/${documentId}`;
          newFilename = `${newParent.filename}/${docToMove.title}`;
        }
      }

      const updatedDoc = await this.update({
        uid,
        document: {
          id: documentId,
          path: newPath,
          filename: newFilename
        }
      });

      // Update all child documents
      const childDocs = await this.getMany({ uid, parentId: documentId });
      for (const childDoc of childDocs) {
        await this.move({
          uid,
          documentId: childDoc.id,
          newParentId: documentId
        });
      }

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
      return doc.filename;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
