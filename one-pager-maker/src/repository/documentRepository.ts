import { ForCreate, ForUpdate } from "../entity/utils.ts";
import { Document } from "../entity/documentType.ts";
import { DocumentRepositoryImpl } from "./documentRepositoryImpl.ts";

export const documentRepository: DocumentRepository =
  new DocumentRepositoryImpl();

export interface DocumentRepository {
  create(args: {
    uid: string;
    document: ForCreate<Document>;
  }): Promise<Document>;

  getByPath(args: { uid: string; filepath: string }): Promise<Document | null>;

  getManyByPath(args: { uid: string; filepath: string }): Promise<Document[]>;

  update(args: {
    uid: string;
    document: ForUpdate<Document>;
  }): Promise<Document>;

  deleteByPath(args: { uid: string; filepath: string }): Promise<Document>;
}
