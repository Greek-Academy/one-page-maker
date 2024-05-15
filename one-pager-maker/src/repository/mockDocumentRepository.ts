import {DocumentRepository} from "./documentRepository.ts";
import {ForCreate} from "../entity/utils.ts";
import {Document} from "../entity/documentType.ts";
import {Timestamp} from "firebase/firestore";
import {MockDBRepository} from "./shared/mockDBRepository.ts";

export class MockDocumentRepository implements DocumentRepository {
    private readonly mock = new MockDBRepository<Document>();

    /**
     * データを全て削除する
     */
    clear() {
        this.mock.clear();
    }

    create({uid, document}: {
        uid: string;
        document: ForCreate<Document>
    }): Promise<Document> {
        const doc: Document = {
            ...document,
            id: '',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        }
        return this.mock.create({uid: uid, data: doc});
    }

    async delete({uid, document}: { uid: string; document: Document }): Promise<Document> {
        await this.mock.delete({uid: uid, id: document.id});
        return document;
    }

    get({uid, documentId}: { uid: string; documentId: string }): Promise<Document | null> {
        return this.mock.get({uid: uid, dataId: documentId});
    }

    getMany({uid}: { uid: string }): Promise<Document[]> {
        return Promise.resolve(
            this.mock.getAll().get(uid) ?? []
        )
    }

    async update({uid, document}: { uid: string; document: Document }): Promise<Document> {
        await this.mock.update({uid: uid, data: document});
        return document;
    }

}
