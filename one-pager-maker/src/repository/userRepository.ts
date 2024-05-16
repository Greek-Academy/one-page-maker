import {User} from "../entity/user/userType.ts";
import {ForCreateWithId, ForUpdate} from "../entity/utils.ts";
import {QueryParams} from "./shared/utils.ts";

export interface UserRepository {
    create(user: ForCreateWithId<User>): Promise<User>;
    update(user: ForUpdate<User>): Promise<void>;
    findUnique(id: string): Promise<User | undefined>;
    findMany(query: QueryParams<User>): Promise<User[]>;
    delete(id: string): Promise<void>;
}