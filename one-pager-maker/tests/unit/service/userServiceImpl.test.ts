import {beforeEach, describe, expect, test} from "vitest";
import {container} from "tsyringe";
import {UserServiceImpl} from "../../../src/service/userServiceImpl";
import {userFactory} from "../../_shared/factory/userFactory";
import {DI} from "../../../src/di";
import {MockUserRepository} from "../../_shared/mock/mockUserRepository";
import {MockAuthRepository} from "../../_shared/mock/mockAuthRepository";

describe('UserServiceImpl', () => {
    const service = container.resolve(UserServiceImpl);
    const userRepository = container.resolve<MockUserRepository>(DI.UserRepository);
    const authRepository = container.resolve<MockAuthRepository>(DI.AuthRepository);

    beforeEach(() => {
        userRepository.clear();
        authRepository.setUser(null);
    });

    describe('createUser', () => {
        test('create user', async () => {
            await authRepository.setUser('test');
            const result = await service.createUser({
                id: 'test',
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isSuccess).toBe(true);
        });

        test.each([
            'abcdefghijklm',
            'nopqrstuvwxyz',
            'ABCDEFGHIJKLM',
            'NOPQRSTUVWXYZ',
            '0123456789-_'
        ])('create user with available id (%s)', async (id) => {
            await authRepository.setUser('test');
            const result = await service.createUser({
                id,
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
            await authRepository.setUser(existingUser.uid);
            await service.createUser(existingUser);
            const anotherUser = userFactory.build({
                id: existingUser.id
            });
            await authRepository.setUser(anotherUser.uid);
            const result = await service.createUser(anotherUser);

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('duplicated-id');
        });

        test.each([
            '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*',
            '+', ',', '.', '/', ':', ';', '<', '=', '>',
            '?', '@', '^', '|', '~', '`', '[', ']', '{', '}'
        ])(`throws error if id contains invalid character (%s)`, async (char) => {
            const result = await service.createUser({
                id: `test${char}`,
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('invalid-id');
        })

        test('throws error if id is too long', async () => {
            const id = 'a'.repeat(21);
            const result = await service.createUser({
                id,
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('too-long-id');
        });

        test('throws error if user is not logged in', async () => {
            const result = await service.createUser({
                id: 'test',
                uid: 'test',
                photoUrl: 'https://example.com'
            });

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('permission-denied');
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

    describe('findUserByID', () => {
        test('find user by id', async () => {
            const user = await userRepository.create(userFactory.build());

            const result = await service.findUserByID(user.id);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(user);
        });

        test('throws error if user is not found', async () => {
            const result = await service.findUserByID('not-found');

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('user-not-found');
        });

        test('throws error if id is empty', async () => {
            const result = await service.findUserByID('');

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('empty-id');
        });
    });

    describe('findUserByUID', () => {
        test('find user by uid', async () => {
            const user = await userRepository.create(userFactory.build());
            authRepository.setUser(user.uid);

            const result = await service.findUserByUID(user.uid);

            expect(result.isSuccess).toBe(true);
            expect(result.value).toEqual(user);
        });

        test('throws error if user is not found', async () => {
            const uid = 'test-uid';
            authRepository.setUser(uid);
            const result = await service.findUserByUID(uid);

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('user-not-found');
        });

        test('throws error if uid is empty', async () => {
            const result = await service.findUserByUID('');

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('empty-id');
        });

        test('throws error if user is not logged in', async () => {
            const result = await service.findUserByUID('test-uid');

            expect(result.isFailure).toBe(true);
            expect(result.error.code).toBe('permission-denied');
        });
    });
})
