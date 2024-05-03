import {Document} from "../entity/documentType.ts";
import {DocumentServiceImpl} from "./documentServiceImpl.ts";
import {documentRepository} from "../repository/documentRepository.ts";

export const documentService: DocumentService = new DocumentServiceImpl(documentRepository);

export interface DocumentService {
    get(uid: string, documentId: string): Promise<Document | undefined>;

    getMany(uid: string): Promise<Document[]>;

    create(uid: string): Promise<Document>;

    update(uid: string, document: Document): Promise<Document>;

    delete(uid: string, document: Document): Promise<Document>;

    updateTitle(uid: string, document: Document, newTitle: string): Promise<Document>;
}
