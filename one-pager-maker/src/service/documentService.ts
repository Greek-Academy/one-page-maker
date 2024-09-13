import { Document } from "../entity/documentType.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Result } from "result-type-ts";

export interface DocumentService {
  getDocument(args: {
    uid: string;
    filepath: string;
  }): Promise<Result<Document | undefined, DocumentServiceError>>;

  createDocument(args: {
    uid: string;
    filepath: string;
    filename: string;
  }): Promise<Document>;

  updateDocument(uid: string, document: ForUpdate<Document>): Promise<Document>;

  deleteDocument(args: { uid: string; filepath: string }): Promise<Document>;

  getDocumentsByPath(args: {
    uid: string;
    filepath: string;
  }): Promise<Document[]>;
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
