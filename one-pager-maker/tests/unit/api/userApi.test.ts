import {describe, test, expect} from "vitest";
import {renderHook, waitFor} from "@testing-library/react";
import {userApi} from "../../../src/api/userApi";
import {container} from "tsyringe";
import {DI} from "../../../src/di";
import {MockUserRepository} from "../../_shared/mock/mockUserRepository";
import {MockAuthRepository} from "../../_shared/mock/mockAuthRepository";
import {userFactory} from "../../_shared/factory/userFactory";
import {queryWrapper} from "../../_shared/queryWrapper";

describe.todo('userApi', () => {
    const userRepository = container.resolve<MockUserRepository>(DI.UserRepository);
    const authRepository = container.resolve<MockAuthRepository>(DI.AuthRepository);

    describe('useSearchUsersQuery', () => {
        test('', async () => {
            const user = userFactory.build({
                id: 'abcde'
            });
            await userRepository.create(user);
            await authRepository.setUser(user.uid);

            const {result} = renderHook(
                () => userApi.useSearchUsersQuery('abc'),
                {wrapper: queryWrapper}
            )
            await waitFor(() => result.current.isSuccess)

            expect(result.current.data).equals(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: user.id,
                        uid: user.uid,
                        photoUrl: user.photoUrl,
                    })
                ])
            )
        })
    });
});