import {describe, test, expect} from "vitest";
import {UserDomainServiceImpl} from "../../../src/domain_service/userDomainServiceImpl";
import {container} from "tsyringe";
import {DI} from "../../../src/di";
import {MockUserRepository} from "../../_shared/mock/mockUserRepository";
import {userFactory} from "../../_shared/factory/userFactory";

describe('UserDomainServiceImpl', () => {
    const userRepository = container.resolve<MockUserRepository>(DI.UserRepository);
    const service = container.resolve(UserDomainServiceImpl);

    describe('isDuplicatedId', () => {
        test('returns false if id is not duplicated', async () => {
            const result = await service.isDuplicatedId('test');
            expect(result).toBe(false);
        });

        test('returns true if id is duplicated', async () => {
            const user = userFactory.build();
            await userRepository.create(user);
            const result = await service.isDuplicatedId(user.id);
            expect(result).toBe(true);
        })
    });
})