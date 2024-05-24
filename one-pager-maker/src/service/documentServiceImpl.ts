import {DocumentService} from "./documentService.ts";
import {DocumentRepository} from "../repository/documentRepository.ts";
import {Document} from "../entity/documentType.ts";
import {inject, injectable} from "tsyringe";
import {DI} from "../di.ts";
import {ForUpdate} from "../entity/utils.ts";
import {ViewHistoryService} from "./viewHistoryService.ts";

@injectable()
export class DocumentServiceImpl implements DocumentService {
    constructor(
        @inject(DI.DocumentRepository) private documentRepository: DocumentRepository,
        @inject(DI.ViewHistoryService) private viewHistoryService: ViewHistoryService,
    ) {
    }

    async getDocument({uid, documentId}: {uid: string, documentId: string}): Promise<Document | undefined> {
        try {
            const result = await this.documentRepository.get({
                uid,
                documentId
            });

            return result ?? undefined;
        } catch (e) {
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

`
        try {
            const doc = await this.documentRepository.create({
                uid,
                document: {
                    title: "New document",
                    contents: template,
                    status: 'draft',
                    owner_id: uid,
                    contributors: [],
                    reviewers: [],
                    url_privilege: 'private',
                    deleted_at: null,
                }
            });
            await this.viewHistoryService.setEditHistory({
                uid,
                documentId: doc.id,
            });
            return doc;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async deleteDocument({uid, documentId}: {uid: string, documentId: string}): Promise<Document> {
        try {
            return await this.documentRepository.delete({
                uid, documentId
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async updateDocument(uid: string, document: ForUpdate<Document>): Promise<Document> {
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
