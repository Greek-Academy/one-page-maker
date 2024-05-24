import {UserRepository} from "../../../src/repository/userRepository";
import {ForCreateWithId, ForUpdate} from "../../../src/entity/utils";
import {User} from "../../../src/entity/user/userType";
import {Timestamp} from "firebase/firestore";
import {filterByQuery, QueryParams, sortByQuery} from "../../../src/repository/shared/utils";
import {singleton} from "tsyringe";

@singleton()
export class MockUserRepository implements UserRepository {
    private store: User[] = [];

    clear(): void {
        this.store = [];
    }

    create(user: ForCreateWithId<User>): Promise<User> {
        const newUser = {
            ...user,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
        };
        this.store.push(newUser);
        return Promise.resolve(newUser);
    }

    delete(id: string): Promise<void> {
        const index = this.store.findIndex((user) => user.id === id);
        if (index === -1) {
            return Promise.reject(new MockUserRepositoryError(`User ${id} not found`));
        }
        this.store.splice(index, 1);
        return Promise.resolve();
    }

    findUnique(id: string): Promise<User | undefined> {
        return Promise.resolve(this.store.find((user) => user.id === id));
    }

    update(user: ForUpdate<User>): Promise<void> {
        const index = this.store.findIndex((u) => u.id === user.id);
        if (index === -1) {
            return Promise.reject(new MockUserRepositoryError(`User ${user.id} not found`));
        }
        this.store[index] = {
            ...this.store[index],
            ...user,
            updated_at: Timestamp.now(),
        };
        return Promise.resolve();
    }

    findMany(query: QueryParams<User>): Promise<User[]> {
        return Promise.resolve(
            this.store
                .sort((a, b) => sortByQuery(a, b, query))
                .filter((val) => filterByQuery(val, query))
                .slice(0, query.limit)
        );
    }

}

class MockUserRepositoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MockUserRepositoryError';
    }
}
