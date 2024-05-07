import {Timestamp} from "firebase/firestore";
import {ForCreate} from "../../entity/utils.ts";

type DBEntity =  {id: string, created_at: Timestamp, updated_at: Timestamp};

export class MockFirestoreRepository<T extends DBEntity> {
    // [uid]: datas の形式
    private store = new Map<string, T[]>();
    private index = 0;

    /**
     * データを全て削除する
     */
    clear() {
        this.store = new Map<string, T[]>();
    }

    create({uid, data}: {
        uid: string;
        data: ForCreate<T>
    }): Promise<T> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const result: T = {
            ...data,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            id: `data-${this.index++}`
        }

        if (!this.store.has(uid)) {
            this.store.set(uid, []);
        }

        this.store.get(uid)!.push(result);

        return Promise.resolve(result);
    }

    delete({uid, data}: { uid: string; data: T }): Promise<T> {
        const result: T = {
            ...data,
            updated_at: Timestamp.now(),
            deleted_at: Timestamp.now(),
        }

        if (!this.store.has(uid)) {
            return Promise.reject(`${uid} does not have any datas`);
        }

        const docs = this.store.get(uid)!;
        const index = docs.findIndex(d => d.id === data.id);

        if (index === -1) {
            return Promise.reject(`${uid} does not have data ${data.id}`);
        }

        docs[index] = result;

        return Promise.resolve(result);
    }

    get({uid, dataId}: { uid: string; dataId: string }): Promise<T | null> {
        if (!this.store.has(uid)) {
            return Promise.resolve(null)
        }

        const data = this.store.get(uid)!.find(d => d.id === dataId) ?? null;

        return Promise.resolve(data);
    }

    getMany({uid}: { uid: string }): Promise<T[]> {
        if (!this.store.has(uid)) {
            // return Promise.reject(`${uid} does not have any datas`);
            return Promise.resolve([]);
        }

        const datas = this.store.get(uid)!;

        return Promise.resolve(datas);
    }

    update({uid, data}: { uid: string; data: T }): Promise<T> {
        const result: T = {
            ...data,
            updated_at: Timestamp.now(),
        }

        if (!this.store.has(uid)) {
            return Promise.reject(`${uid} does not have any datas`);
        }

        const docs = this.store.get(uid)!;
        const index = docs.findIndex(d => d.id === data.id);

        if (index === -1) {
            return Promise.reject(`${uid} does not have data ${data.id}`);
        }

        docs[index] = result;

        return Promise.resolve(result);
    }

}
