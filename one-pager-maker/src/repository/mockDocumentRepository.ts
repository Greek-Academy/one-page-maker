import {DocumentRepository} from "./documentRepository.ts";
import {ForCreate} from "../entity/utils.ts";
import {Document} from "../entity/documentType.ts";
import {Timestamp} from "firebase/firestore";

export class MockDocumentRepository implements DocumentRepository {
    // [uid]: documents の形式
    private store = new Map<string, Document[]>();
    private index = 0;

    /**
     * データを全て削除する
     */
    clear() {
        this.store = new Map<string, Document[]>();
    }

    create({uid, document}: {
        uid: string;
        document: ForCreate<Document>
    }): Promise<Document> {
        const result: Document = {
            ...document,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            id: `document-${this.index++}`
        }

        if (!this.store.has(uid)) {
            this.store.set(uid, []);
        }

        this.store.get(uid)!.push(result);

        return Promise.resolve(result);
    }

    delete({uid, document}: { uid: string; document: Document }): Promise<Document> {
        const result: Document = {
            ...document,
            updated_at: Timestamp.now(),
            deleted_at: Timestamp.now(),
        }

        if (!this.store.has(uid)) {
            return Promise.reject(`${uid} does not have any documents`);
        }

        const docs = this.store.get(uid)!;
        const index = docs.findIndex(d => d.id === document.id);

        if (index === -1) {
            return Promise.reject(`${uid} does not have document ${document.id}`);
        }

        docs[index] = result;

        return Promise.resolve(result);
    }

    get({uid, documentId}: { uid: string; documentId: string }): Promise<Document | null> {
        if (!this.store.has(uid)) {
            return Promise.resolve(null)
        }

        const document = this.store.get(uid)!.find(d => d.id === documentId) ?? null;

        return Promise.resolve(document);
    }

    getMany({uid}: { uid: string }): Promise<Document[]> {
        if (!this.store.has(uid)) {
            // return Promise.reject(`${uid} does not have any documents`);
            return Promise.resolve([]);
        }

        const documents = this.store.get(uid)!;

        return Promise.resolve(documents);
    }

    update({uid, document}: { uid: string; document: Document }): Promise<Document> {
        const result: Document = {
            ...document,
            updated_at: Timestamp.now(),
        }

        if (!this.store.has(uid)) {
            return Promise.reject(`${uid} does not have any documents`);
        }

        const docs = this.store.get(uid)!;
        const index = docs.findIndex(d => d.id === document.id);

        if (index === -1) {
            return Promise.reject(`${uid} does not have document ${document.id}`);
        }

        docs[index] = result;

        return Promise.resolve(result);
    }

}
