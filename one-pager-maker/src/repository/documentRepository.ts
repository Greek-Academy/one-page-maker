import {ForCreate} from "../entity/utils.ts";
import {Document} from "../entity/documentType.ts";
import {DocumentRepositoryImpl} from "./documentRepositoryImpl.ts";

export const documentRepository: DocumentRepository = new DocumentRepositoryImpl();

export interface DocumentRepository {
    create(args: {uid: string, document: ForCreate<Document>}): Promise<Document>;

    get(args: {uid: string, documentId: string}): Promise<Document | null>;

    getMany(args: {uid: string}): Promise<Document[]>;

    update(args: {uid: string, document: Document}): Promise<Document>;

    delete(args: {uid: string, document: Document}): Promise<Document>;
}
