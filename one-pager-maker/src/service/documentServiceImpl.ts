import { DocumentService, DocumentServiceError } from "./documentService.ts";
import { DocumentRepository } from "../repository/documentRepository.ts";
import { Document } from "../entity/documentType.ts";
import { inject, injectable } from "tsyringe";
import { DI } from "../di.ts";
import { ForUpdate } from "../entity/utils.ts";
import { ViewHistoryService } from "@/service/viewHistoryService.ts";
import { Result } from "result-type-ts";
import { FirestoreError } from "@firebase/firestore";

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

  async createDocument(uid: string): Promise<Document> {
    const template = `# Summary

# Background

# Design/Proposal

# Open questions

# Reference

# Memo

`;
    try {
      const doc = await this.documentRepository.create({
        uid,
        document: {
          title: "New document",
          contents: template,
          status: "draft",
          owner_id: uid,
          contributors: [uid],
          reviewers: [],
          url_privilege: "private",
          deleted_at: null
        }
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
}
