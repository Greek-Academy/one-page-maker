import {UserService, UserServiceError} from "./userService.ts";
import {Result} from "result-type-ts";
import {User} from "../entity/user/userType.ts";
import {UserRepository} from "../repository/userRepository.ts";
import {inject, injectable} from "tsyringe";
import {DI} from "../di.ts";
import {UserDomainService} from "../domain_service/userDomainService.ts";
import {AuthRepository} from "../repository/authRepository.ts";
import {createUser} from "../entity/user/user.ts";

@injectable()
export class UserServiceImpl implements UserService {
    constructor(
        @inject(DI.UserRepository) private readonly userRepository: UserRepository,
        @inject(DI.UserDomainService) private readonly userDomainService: UserDomainService,
        @inject(DI.AuthRepository) private readonly authRepository: AuthRepository,
    ) {
    }

    async createUser(args: { id: string; uid: string; photoUrl: string }): Promise<Result<User, UserServiceError>> {
        try {
            const createUserResult = createUser(args);

            if (createUserResult.isFailure) {
                return Result.failure(new UserServiceError(createUserResult.error.message, createUserResult.error.code));
            }

            const isDuplicated = await this.userDomainService.isDuplicatedId(args.id);

            if (isDuplicated) {
                return Result.failure(new UserServiceError("ID is duplicated.", 'duplicated-id'));
            }

            const user = await this.userRepository.create({
                id: args.id,
                uid: args.uid,
                photoUrl: args.photoUrl,
            });
            return Result.success(user);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error happened.';
            console.error(e);
            return Result.failure(new UserServiceError(msg, 'unknown'));
        }
    }

    async searchUsers(query: { id: string }): Promise<Result<User[], UserServiceError>> {
        try {
            const users = await this.userRepository.findMany({
                orderBy: {
                    field: 'id',
                    direction: 'asc'
                },
                startAfter: query.id,
                endBefore: query.id + '\uf8ff',
            });

            return Result.success(users);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error happened.';
            console.error(e);
            return Result.failure(new UserServiceError(msg, 'unknown'));
        }
    }

    async findUserByID(id: string): Promise<Result<User, UserServiceError>> {
        try {
            if (id === '') {
                return Result.failure(new UserServiceError("ID is empty.", 'empty-id'));
            }

            const user = await this.userRepository.findUnique(id);
            if (!user) {
                return Result.failure(new UserServiceError("User not found.", 'user-not-found'));
            }
            return Result.success(user);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error happened.';
            console.error(e);
            return Result.failure(new UserServiceError(msg, 'unknown'));
        }
    }

    async findUserByUID(uid: string): Promise<Result<User, UserServiceError>> {
        try {
            if (uid === '') {
                return Result.failure(new UserServiceError("UID is empty.", 'empty-id'));
            }

            const currentUser = await this.authRepository.currentUser();

            if (currentUser === null || currentUser.uid !== uid) {
                return Result.failure(new UserServiceError("You can't get unsigned-in user's data.", 'permission-denied'));
            }

            const user = await this.userRepository.findMany({
                where: {
                    field: 'uid',
                    op: '==',
                    value: uid,
                },
                limit: 1
            });

            if (user.length <= 0) {
                return Result.failure(new UserServiceError("User not found.", 'user-not-found'));
            }

            return Result.success(user[0]);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error happened.';
            console.error(e);
            return Result.failure(new UserServiceError(msg, 'unknown'));
        }
    }

}
