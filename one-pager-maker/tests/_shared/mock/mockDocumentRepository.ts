import { DocumentRepository } from "../../../src/repository/documentRepository";
import { ForCreate } from "../../../src/entity/utils";
import { Document } from "../../../src/entity/documentType";
import { Timestamp } from "firebase/firestore";
import { MockDBRepository } from "../../../src/repository/shared/mockDBRepository";
import { singleton } from "tsyringe";

@singleton()
export class MockDocumentRepository implements DocumentRepository {
  private readonly mock = new MockDBRepository<Document>();

  /**
   * データを全て削除する
   */
  clear() {
    this.mock.clear();
  }

  create({
    uid,
    document
  }: {
    uid: string;
    document: ForCreate<Document>;
  }): Promise<Document> {
    const doc: Document = {
      ...document,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now()
    };
    return this.mock.create({ uid: uid, data: doc });
  }

  async delete({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Document> {
    const document = await this.get({ uid, documentId });
    const data = {
      ...document,
      id: document.id,
      deleted_at: Timestamp.now()
    };
    await this.mock.update({ uid, data });
    return data;
  }

  get({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Document | null> {
    return this.mock.get({ uid: uid, dataId: documentId });
  }

  getMany({ uid }: { uid: string }): Promise<Document[]> {
    return Promise.resolve(this.mock.getAll().get(uid) ?? []);
  }

  async update({
    uid,
    document
  }: {
    uid: string;
    document: Document;
  }): Promise<Document> {
    const data = {
      ...document,
      updated_at: Timestamp.now()
    };
    await this.mock.update({ uid, data });
    return data;
  }
}
