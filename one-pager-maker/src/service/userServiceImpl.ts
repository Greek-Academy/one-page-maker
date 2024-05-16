import {UserService, UserServiceError} from "./userService.ts";
import {Result} from "result-type-ts";
import {User} from "../entity/user/userType.ts";
import {z} from "zod";
import {UserRepository} from "../repository/userRepository.ts";
import {inject, injectable} from "tsyringe";
import {DI} from "../di.ts";
import {UserDomainService} from "../domain_service/userDomainService.ts";

const urlSchema = z.string().url();

@injectable()
export class UserServiceImpl implements UserService {
    constructor(
        @inject(DI.UserRepository) private readonly userRepository: UserRepository,
        @inject(DI.UserDomainService) private readonly userDomainService: UserDomainService
    ) {
    }

    async createUser(args: { id: string; uid: string; photoUrl: string }): Promise<Result<User, UserServiceError>> {
        try {
            if (args.id === '') {
                return Result.failure(new UserServiceError("ID is empty.", 'empty-id'));
            }

            const parserPhotoUrl = urlSchema.safeParse(args.photoUrl);

            if (!parserPhotoUrl.success) {
                return Result.failure(new UserServiceError("photoUrl is invalid.", 'invalid-url'));
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

}