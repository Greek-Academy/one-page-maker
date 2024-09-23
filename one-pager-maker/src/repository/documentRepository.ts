import { ForCreate, ForUpdate } from "../entity/utils.ts";
import { Document } from "../entity/documentType.ts";
import { DocumentRepositoryImpl } from "./documentRepositoryImpl.ts";

export const documentRepository: DocumentRepository =
  new DocumentRepositoryImpl();

export interface DocumentRepository {
  create(args: {
    uid: string;
    document: ForCreate<Document>;
    parentId?: string;
  }): Promise<Document>;

  get(args: { uid: string; documentId: string }): Promise<Document | null>;

  getMany(args: { uid: string; parentId?: string }): Promise<Document[]>;

  getPath(args: { uid: string; documentId: string }): Promise<string>;

  update(args: {
    uid: string;
    document: ForUpdate<Document>;
  }): Promise<Document>;

  move(args: {
    uid: string;
    documentId: string;
    newParentId: string | null;
  }): Promise<Document>;

  delete(args: { uid: string; documentId: string }): Promise<Document>;
}
