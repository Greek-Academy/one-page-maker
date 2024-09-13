import { DocumentRepository } from "./documentRepository.ts";
import { ForCreate, ForUpdate, WithTimestamp } from "../entity/utils.ts";
import { Document, documentConverter } from "../entity/documentType.ts";
import {
  collection,
  doc,
  query,
  serverTimestamp,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { FirestoreClientManager } from "./shared/firestoreClientManager.ts";
import { injectable } from "tsyringe";

@injectable()
export class DocumentRepositoryImpl implements DocumentRepository {
  private readonly colRef = (uid: string) =>
    collection(db, `users/${uid}/documents`).withConverter(documentConverter);
  private readonly docRef = (uid: string, docId: string) =>
    doc(db, `users/${uid}/documents/${docId}`).withConverter(documentConverter);

  private readonly clientManager = FirestoreClientManager.INSTANCE;

  async create({
    uid,
    document
  }: {
    uid: string;
    document: ForCreate<Document>;
  }): Promise<Document> {
    try {
      const ref = doc(this.colRef(uid));
      const data: WithTimestamp<Document> = {
        ...document,
        id: ref.id,
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

  async deleteByPath({
    uid,
    filepath
  }: {
    uid: string;
    filepath: string;
  }): Promise<Document> {
    try {
      const querySnapshot = await this.clientManager
        .getClient()
        .getMany(query(this.colRef(uid), where("filepath", "==", filepath)));

      if (querySnapshot.empty) {
        return Promise.reject(new Error("Document not found"));
      }

      const docRef = querySnapshot.docs[0].ref;
      await this.clientManager.getClient().update(docRef, {
        updated_at: serverTimestamp(),
        deleted_at: serverTimestamp()
      });

      const updatedSnapshot = await this.clientManager.getClient().get(docRef);
      const result = updatedSnapshot.data();

      if (result === undefined) {
        return Promise.reject(new Error("Document not found"));
      }

      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getByPath({
    uid,
    filepath
  }: {
    uid: string;
    filepath: string;
  }): Promise<Document | null> {
    try {
      const querySnapshot = await this.clientManager
        .getClient()
        .getMany(query(this.colRef(uid), where("filepath", "==", filepath)));

      return querySnapshot.empty ? null : querySnapshot.docs[0].data();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getManyByPath({
    uid,
    filepath
  }: {
    uid: string;
    filepath: string;
  }): Promise<Document[]> {
    try {
      const querySnapshot = await this.clientManager
        .getClient()
        .getMany(query(this.colRef(uid), where("filepath", "==", filepath)));

      return querySnapshot.docs.map((doc) => doc.data());
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
}
