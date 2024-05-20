import {beforeAll, beforeEach, describe, test, expect} from "vitest";
import {UserRepositoryImpl} from "../../../src/repository/userRepositoryImpl";
import {
    deleteFirestoreEmulatorData,
    useFirestoreEmulator
} from "../firebaseEmulatorUtils";
import {userFactory} from "../../_shared/factory/userFactory";

describe("UserRepositoryImpl Test", () => {
    const repository = new UserRepositoryImpl();

    beforeAll(() => useFirestoreEmulator());

    beforeEach(() => deleteFirestoreEmulatorData());

    describe('create()', function () {
        test("returns correct data", async () => {
            const id = 'test';
            await repository.create(userFactory.build({
                id,
            }));
            const result = await repository.findUnique(id);
            expect(result).not.toBeUndefined();
            expect(result).toHaveProperty('id', id);
        })
    });
})
