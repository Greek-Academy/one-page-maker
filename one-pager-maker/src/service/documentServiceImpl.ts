import { DocumentService, DocumentServiceError } from "./documentService.ts";
import { DocumentRepository } from "../repository/documentRepository.ts";
import { Document } from "../entity/documentType.ts";
import { inject, injectable } from "tsyringe";
import { DI } from "../di.ts";
import { ForUpdate, ForCreate } from "../entity/utils.ts";
import { ViewHistoryService } from "@/service/viewHistoryService.ts";
import { Result } from "result-type-ts";
import { FirestoreError } from "@firebase/firestore";
import { Timestamp } from "firebase/firestore";

@injectable()
export class DocumentServiceImpl implements DocumentService {
  constructor(
    @inject(DI.DocumentRepository)
    private documentRepository: DocumentRepository,
    @inject(DI.ViewHistoryService)
    private viewHistoryService: ViewHistoryService
  ) {}

  async getDocument({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Result<Document | undefined, DocumentServiceError>> {
    try {
      const result = await this.documentRepository.get({ uid, documentId });
      return Result.success(result ?? undefined);
    } catch (e) {
      return this.handleFirestoreErrorSingle(e);
    }
  }

  async getDocumentsUnderParent({
    uid,
    parentId
  }: {
    uid: string;
    parentId?: string;
  }): Promise<Result<Document[], DocumentServiceError>> {
    try {
      const result = await this.documentRepository.getMany({ uid, parentId });
      return Result.success(result);
    } catch (e) {
      return this.handleFirestoreErrorMultiple(e);
    }
  }

  async createDocument(uid: string, parentId?: string): Promise<Document> {
    const newDocument = this.createNewDocumentObject(uid, parentId);
    try {
      const doc = await this.documentRepository.create({
        uid,
        document: newDocument,
        parentId
      });
      await this.viewHistoryService.setEditHistory({ uid, documentId: doc.id });
      return doc;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteDocument({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<Document> {
    try {
      return await this.documentRepository.delete({
        uid,
        documentId
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async updateDocument(
    uid: string,
    document: ForUpdate<Document>
  ): Promise<Document> {
    try {
      return await this.documentRepository.update({
        uid,
        document
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async moveDocument({
    uid,
    documentId,
    newParentId
  }: {
    uid: string;
    documentId: string;
    newParentId: string | null;
  }): Promise<Document> {
    return this.documentRepository.move({ uid, documentId, newParentId });
  }

  async getDocumentPath({
    uid,
    documentId
  }: {
    uid: string;
    documentId: string;
  }): Promise<string> {
    try {
      return await this.documentRepository.getPath({
        uid,
        documentId
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async setDocumentPublishStatus(
    uid: string,
    documentId: string,
    isPublished: boolean
  ): Promise<Document> {
    try {
      const published_at = isPublished ? Timestamp.now() : null;
      return await this.documentRepository.update({
        uid,
        document: {
          id: documentId,
          published_at
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private createNewDocumentObject(
    uid: string,
    parentId?: string
  ): ForCreate<Document> {
    const title = "New document";
    const path = parentId ? `${parentId}` : title;
    const filename = title;

    return {
      title,
      contents: this.getDocumentTemplate(),
      status: "draft",
      owner_id: uid,
      contributors: [uid],
      reviewers: [],
      url_privilege: "private",
      deleted_at: null,
      published_at: null,
      path,
      filename
    };
  }

  private getDocumentTemplate(): string {
    return `# Summary

# Background

# Design/Proposal

# Open questions

# Reference

# Memo

`;
  }

  private handleFirestoreErrorSingle(
    e: unknown
  ): Result<undefined, DocumentServiceError> {
    if (e instanceof FirestoreError) {
      switch (e.code) {
        case "permission-denied":
          return Result.failure(
            new DocumentServiceError(e.message, "permission-denied")
          );
        case "not-found":
          return Result.success(undefined);
        default:
          return Result.failure(new DocumentServiceError(e.message, "unknown"));
      }
    }
    return Result.failure(new DocumentServiceError("Unknown error", "unknown"));
  }

  private handleFirestoreErrorMultiple(
    e: unknown
  ): Result<Document[], DocumentServiceError> {
    if (e instanceof FirestoreError) {
      switch (e.code) {
        case "permission-denied":
          return Result.failure(
            new DocumentServiceError(e.message, "permission-denied")
          );
        case "not-found":
          return Result.success([]);
        default:
          return Result.failure(new DocumentServiceError(e.message, "unknown"));
      }
    }
    return Result.failure(new DocumentServiceError("Unknown error", "unknown"));
  }
}
