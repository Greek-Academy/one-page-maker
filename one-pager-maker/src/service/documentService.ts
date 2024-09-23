import { Document } from "../entity/documentType.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Result } from "result-type-ts";

export interface DocumentService {
  getDocument(args: {
    uid: string;
    documentId: string;
  }): Promise<Result<Document | undefined, DocumentServiceError>>;

  getDocumentsUnderParent(args: {
    uid: string;
    parentId?: string;
  }): Promise<Result<Document[], DocumentServiceError>>;

  createDocument(uid: string, parentId?: string): Promise<Document>;

  updateDocument(uid: string, document: ForUpdate<Document>): Promise<Document>;

  deleteDocument(args: { uid: string; documentId: string }): Promise<Document>;

  moveDocument(args: {
    uid: string;
    documentId: string;
    newParentId: string | null;
  }): Promise<Document>;

  getDocumentPath(args: { uid: string; documentId: string }): Promise<string>;
}

type DocumentServiceErrorCode = "permission-denied" | "unknown";

export class DocumentServiceError extends Error {
  constructor(
    message: string,
    public readonly code: DocumentServiceErrorCode
  ) {
    super(message);
    this.name = "DocumentServiceError";
  }
}
