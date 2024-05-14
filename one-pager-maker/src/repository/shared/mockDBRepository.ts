import {Timestamp} from "firebase/firestore";
import {ForCreate, ForUpdate} from "../../entity/utils.ts";

type DBEntity =  {id: string, created_at: Timestamp, updated_at: Timestamp};

class Sequence {
    private index = 0;

    next() {
        return this.index++;
    }
}

export class MockDBRepository<T extends DBEntity> {
    // [uid]: datas の形式
    private store = new Map<string, T[]>();
    private sequence = new Sequence();

    /**
     * データを全て削除する
     */
    clear() {
        this.store = new Map<string, T[]>();
    }

    getAll() {
        return new Map(this.store.entries());
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
            id: `data-${this.sequence.next()}`
        }

        if (!this.store.has(uid)) {
            this.store.set(uid, []);
        }

        this.store.get(uid)!.push(result);

        return Promise.resolve(result);
    }

    delete({uid, id}: { uid: string; id: string }): Promise<void> {
        if (!this.store.has(uid)) {
            return Promise.reject(`${uid} does not have any datas`);
        }

        const docs = this.store.get(uid)!;
        const index = docs.findIndex(d => d.id === id);
        docs.splice(index, 1);
        return Promise.resolve()
    }

    get({uid, dataId}: { uid: string; dataId: string }): Promise<T | null> {
        if (!this.store.has(uid)) {
            return Promise.resolve(null)
        }

        const data = this.store.get(uid)!.find(d => d.id === dataId) ?? null;

        return Promise.resolve(data);
    }

    update({uid, data}: { uid: string; data: ForUpdate<T> }): Promise<void> {
        const userData = this.store.get(uid);

        if (userData === undefined) {
            return Promise.reject(`User ${uid} not found`)
        }

        const old = userData.find(val => val.id === data.id);

        if (old === undefined) {
            return Promise.reject(`Document ${data.id} not found`);
        }

        const result: T = {
            ...old,
            ...data,
            updated_at: Timestamp.now(),
        }

        const index = userData.findIndex(d => d.id === data.id);
        userData[index] = result;

        return Promise.resolve();
    }

}
