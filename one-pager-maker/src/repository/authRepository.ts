import {User} from "@firebase/auth";

export interface AuthRepository {
    currentUser(): User | null
}