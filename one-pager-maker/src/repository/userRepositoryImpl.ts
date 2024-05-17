import {UserRepository} from "./userRepository.ts";
import {ForCreateWithId, ForUpdate, WithTimestamp} from "../entity/utils.ts";
import {User, userConverter} from "../entity/user/userType.ts";
import {FirestoreClientManager} from "./shared/firestoreClientManager.ts";
import {collection, doc, query, serverTimestamp, Timestamp} from "firebase/firestore";
import {db} from "../firebase.ts";
import {injectable} from "tsyringe";
import {buildQueryConstraints, QueryParams} from "./shared/utils.ts";

@injectable()
export class UserRepositoryImpl implements UserRepository {
    private readonly clientManager = FirestoreClientManager.INSTANCE;

    private readonly colRef = () => collection(db, `users`)
        .withConverter(userConverter);

    private readonly docRef = (uid: string) => doc(db, `users/${uid}`)
        .withConverter(userConverter);

    async create(user: ForCreateWithId<User>): Promise<User> {
        try {
            const ref = doc(this.colRef());
            const data: WithTimestamp<Omit<User, 'id'>> = {
                ...user,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            }
            await this.clientManager.getClient().set(ref, data);

            return {
                ...user,
                created_at: Timestamp.now(),
                updated_at: Timestamp.now(),
                id: ref.id,
            };
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.clientManager.getClient().delete(this.docRef(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findUnique(id: string): Promise<User | undefined> {
        try {
            const snapshot = await this.clientManager.getClient().get(this.docRef(id));
            return snapshot.data();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async update(user: ForUpdate<User>): Promise<void> {
        try {
            const ref = this.docRef(user.id);
            const data: Partial<WithTimestamp<User>> = {
                ...user,
                updated_at: serverTimestamp(),
            }
            await this.clientManager.getClient().update(ref, data);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async findMany(_query: QueryParams<User>): Promise<User[]> {
        try {
            const constraints = buildQueryConstraints(_query);
            const q = query(this.colRef(), ...constraints);
            const snapshot = await this.clientManager.getClient().getMany(q);
            return snapshot.docs.map(d => d.data());
        } catch (e) {
            return Promise.reject(e);
        }
    }

}
