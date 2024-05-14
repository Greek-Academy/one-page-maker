import {ViewHistoryRepository} from "./viewHistoryRepository.ts";
import {ForCreate, ForUpdate, WithTimestamp} from "../entity/utils.ts";
import {ViewHistory, viewHistoryConverter} from "../entity/viewHistoryType.ts";
import {
    collection,
    deleteDoc,
    doc,
    query,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import {db} from "../firebase.ts";
import {FirestoreClientManager} from "./shared/firestoreClientManager.ts";
import {buildQueryConstraints, QueryParams} from "./shared/utils.ts";

export class ViewHistoryRepositoryImpl implements ViewHistoryRepository {
    private readonly colRef = (uid: string) => collection(db, `users/${uid}/viewHistories`)
        .withConverter(viewHistoryConverter);
    private readonly docRef = (uid: string, viewHistoryId: string) => doc(db, `users/${uid}/viewHistories/${viewHistoryId}`)
        .withConverter(viewHistoryConverter);

    private readonly clientManager = FirestoreClientManager.INSTANCE;

    async create({uid, viewHistory}: {
        uid: string;
        viewHistory: ForCreate<ViewHistory>
    }): Promise<ViewHistory> {
        try {
            const ref = doc(this.colRef(uid));
            const data: WithTimestamp<ViewHistory> = {
                ...viewHistory,
                id: ref.id,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            }
            await this.clientManager.getClient().set(ref, data);

            return {
                ...data,
                created_at: Timestamp.now(),
                updated_at: Timestamp.now(),
            }
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async delete({uid, viewHistoryId}: {
        uid: string;
        viewHistoryId: string
    }): Promise<void> {
        try {
            await deleteDoc(this.docRef(uid, viewHistoryId));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async get({uid, viewHistoryId}: {
        uid: string;
        viewHistoryId: string
    }): Promise<ViewHistory | null> {
        try {
            const snapshot = await this.clientManager.getClient().get(this.docRef(uid, viewHistoryId));
            return snapshot.data() ?? null;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getMany<K extends keyof ViewHistory>({uid}: { uid: string }, _q: QueryParams<ViewHistory, K>): Promise<ViewHistory[]> {
        try {
            const constraints = buildQueryConstraints(_q);
            const q = query(this.colRef(uid), ...constraints);
            const snapshot = await this.clientManager.getClient().getMany(q);
            return snapshot.docs.map(d => d.data());
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async update({uid, viewHistory}: {
        uid: string;
        viewHistory: ForUpdate<ViewHistory>
    }): Promise<void> {
        try {
            await this.clientManager.getClient().update(this.docRef(uid, viewHistory.id), {
                updated_at: serverTimestamp(),
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

}
