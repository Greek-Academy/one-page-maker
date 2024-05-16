import {describe, expect, test} from "vitest";
import {container} from "tsyringe";
import {UserServiceImpl} from "../../../src/service/userServiceImpl";
import {userFactory} from "../../_shared/factory/userFactory";
import {DI} from "../../../src/di";
import {MockUserRepository} from "../../_shared/mock/mockUserRepository";

describe('UserServiceImpl', () => {
    const service = container.resolve(UserServiceImpl);
    const userRepository = container.resolve(DI.UserRepository) as MockUserRepository;

    describe('createUser', () => {
        test('create user', async () => {
            const result = await service.createUser({
                id: 'test',
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isSuccess).toBe(true);
        });

        test('throws error if id is empty', async () => {
            const result = await service.createUser({
                id: '',
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('empty-id');
        });

        test('throws error if photoUrl is invalid', async () => {
            const result = await service.createUser({
                id: 'test',
                uid: 'test',
                photoUrl: 'example.com'
            });

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('invalid-url');
        });

        test('throws error if user is duplicated', async () => {
            const existingUser = userFactory.build();
            await service.createUser(existingUser);
            const anotherUser = userFactory.build({
                id: existingUser.id
            });
            const result = await service.createUser(anotherUser);

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('duplicated-id');
        });
    });

    describe('searchUsers', () => {
        test('search users with exact id query', async () => {
            const user1 = await userRepository.create(userFactory.build());
            await userRepository.create(userFactory.build());

            const result = await service.searchUsers({id: user1.id});

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual([user1]);
        });

        test('search users with partial id query', async () => {
            await userRepository.create(userFactory.build({
                id: 'a'
            }));
            const user2 = await userRepository.create(userFactory.build({
                id: 'ab'
            }));
            const user3 = await userRepository.create(userFactory.build({
                id: 'abc'
            }));

            const result = await service.searchUsers({id: 'ab'});

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual([user2, user3]);
        });

        test('returns nothing if no user is found', async () => {
            await userRepository.create(userFactory.build({
                id: 'abc'
            }));

            const result = await service.searchUsers({id: 'not-found'});

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual([]);
        });
    });
})