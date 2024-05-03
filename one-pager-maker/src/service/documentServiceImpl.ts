import {DocumentService} from "./documentService.ts";
import {DocumentRepository} from "../repository/documentRepository.ts";
import {Document} from "../entity/documentType.ts";

export class DocumentServiceImpl implements DocumentService {
    constructor(
        private documentRepository: DocumentRepository
    ) {
    }

    /* ---- COMMAND ---- */

    async get(uid: string, documentId: string): Promise<Document | undefined> {
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

    async getMany(uid: string): Promise<Document[]> {
        try {
            return await this.documentRepository.getMany({
                uid
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /* ---- QUERY ---- */

    async create(uid: string): Promise<Document> {
        try {
            return await this.documentRepository.create({
                uid,
                document: {
                    title: "New document",
                    contents: "",
                    status: 'draft',
                    owner_id: uid,
                    contributors: [],
                    reviewers: [],
                    url_privilege: 'private',
                    deleted_at: null,
                }
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async delete(uid: string, document: Document): Promise<Document> {
        try {
            return await this.documentRepository.delete({
                uid: uid,
                document: document
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async updateTitle(uid: string, document: Document, newTitle: string): Promise<Document> {
        try {
            return await this.documentRepository.update({
                uid: uid,
                document: {
                    ...document,
                    title: newTitle
                }
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async update(uid: string, document: Document): Promise<Document> {
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
