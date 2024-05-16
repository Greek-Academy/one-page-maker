type DBEntity =  {id: string};

export class MockDBRepository<T extends DBEntity> {
    // [uid]: datas の形式
    private store = new Map<string, T[]>();

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
        data: T
    }): Promise<T> {
        if (!this.store.has(uid)) {
            this.store.set(uid, []);
        }

        this.store.get(uid)!.push(data);

        return Promise.resolve(data);
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

    update({uid, data}: { uid: string; data: T }): Promise<void> {
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
        }

        const index = userData.findIndex(d => d.id === data.id);
        userData[index] = result;

        return Promise.resolve();
    }

}
