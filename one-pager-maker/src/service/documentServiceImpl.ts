import { DocumentService, DocumentServiceError } from "./documentService.ts";
import { DocumentRepository } from "../repository/documentRepository.ts";
import { Document } from "../entity/documentType.ts";
import { inject, injectable } from "tsyringe";
import { DI } from "../di.ts";
import { ForCreate, ForUpdate } from "../entity/utils.ts";
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
      const result = await this.documentRepository.get({
        uid,
        documentId
      });

      return Result.success(result ?? undefined);
    } catch (e) {
      if (e instanceof FirestoreError) {
        switch (e.code) {
          case "permission-denied":
            return Result.failure(
              new DocumentServiceError(e.message, "permission-denied")
            );
          case "not-found":
            return Result.success(undefined);
          default:
            return Result.failure(
              new DocumentServiceError(e.message, "unknown")
            );
        }
      }
      return Promise.reject(e);
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
      if (e instanceof FirestoreError) {
        switch (e.code) {
          case "permission-denied":
            return Result.failure(
              new DocumentServiceError(e.message, "permission-denied")
            );
          default:
            return Result.failure(
              new DocumentServiceError(e.message, "unknown")
            );
        }
      }
      return Promise.reject(e);
    }
  }

  async createDocument(uid: string, parentId?: string): Promise<Document> {
    const template = `# Summary

# Background

# Design/Proposal

# Open questions

# Reference

# Memo

`;
    try {
      const title = "New document";
      const path = parentId ? `${parentId}` : title;
      const filename = title;

      const newDocument: ForCreate<Document> = {
        title,
        contents: template,
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
    try {
      return await this.documentRepository.move({
        uid,
        documentId,
        newParentId
      });
    } catch (e) {
      return Promise.reject(e);
    }
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
}
