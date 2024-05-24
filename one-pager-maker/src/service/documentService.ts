import {Document} from "../entity/documentType.ts";
import {ForUpdate} from "../entity/utils.ts";

export interface DocumentService {
    getDocument(args: {uid: string, documentId: string}): Promise<Document | undefined>;

    createDocument(uid: string): Promise<Document>;

    updateDocument(uid: string, document: ForUpdate<Document>): Promise<Document>;

    deleteDocument(args: {uid: string, documentId: string}): Promise<Document>;
}
