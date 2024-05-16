import {AuthRepository} from "../../../src/repository/authRepository";
import {User, IdTokenResult} from "@firebase/auth";
import {singleton} from "tsyringe";

@singleton()
export class MockAuthRepository implements AuthRepository {
    private user: User | null = null;

    currentUser(): User | null {
        return this.user;
    }

    setUser(uid: string) {
        this.user = {
            providerData: [],
            refreshToken: "",
            delete(): Promise<void> {
                return Promise.resolve(undefined);
            },
            getIdToken(forceRefresh?: boolean): Promise<string> {
                console.log(forceRefresh)
                return Promise.resolve("");
            },
            getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult> {
                console.log(forceRefresh)
                return Promise.resolve(undefined);
            },
            reload(): Promise<void> {
                return Promise.resolve(undefined);
            },
            toJSON(): object {
                return undefined;
            },
            uid: uid,
            email: "",
            emailVerified: false,
            displayName: "",
            isAnonymous: false,
            photoURL: "",
            phoneNumber: "",
            providerId: "",
            tenantId: "",
            metadata: {
                lastSignInTime: "",
                creationTime: ""
            }
        };
    }
}