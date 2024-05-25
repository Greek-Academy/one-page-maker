import {beforeAll, beforeEach, describe, expect, test} from "vitest";
import {ViewHistoryRepositoryImpl} from "../../../src/repository/viewHistoryRepositoryImpl";
import {viewHistoryFactory} from "../../_shared/factory/viewHistoryFactory";
import {deleteFirestoreEmulatorData, useFirestoreEmulator} from "../firebaseEmulatorUtils";

describe("viewHistoryRepositoryImpl", () => {
    const repository = new ViewHistoryRepositoryImpl();
    const uid = 'uid';

    beforeAll(() => useFirestoreEmulator());

    beforeEach(async () => {
        await deleteFirestoreEmulatorData()
    });

    describe('create()', () => {
        test('should create a new view history', async () => {
            const viewHistory = viewHistoryFactory.build({uid});
            const result = await repository.create({uid, viewHistory});
            expect(result).toMatchObject({uid});
        });
    })

    describe('update()', () => {
        test('should update document', async () => {
            const viewHistory = viewHistoryFactory.build({uid});
            const result = await repository.create({uid, viewHistory});
            await repository.update({
                uid,
                viewHistory: {id: result.id, document: {...result.document, title: "new title"}}
            });
            const updated = await repository.get({uid, viewHistoryId: result.id});
            expect(updated?.document).toMatchObject({title: "new title"});
        });
    })

    describe('get()', () => {
        test('should get document', async () => {
            const viewHistory = viewHistoryFactory.build({uid});
            const result = await repository.create({uid, viewHistory});
            const updated = await repository.get({uid, viewHistoryId: result.id});
            expect(updated).toMatchObject({
                ...result,
                id: updated.id,
                created_at: updated.created_at,
                updated_at: updated.updated_at
            });
        });
    })

    describe('delete()', () => {
        test('should delete document', async () => {
            const viewHistory = viewHistoryFactory.build({uid});
            const result = await repository.create({uid, viewHistory});
            await repository.delete({uid, viewHistoryId: result.id});
            const updated = await repository.get({uid, viewHistoryId: result.id});
            expect(updated).toBeNull();
        });
    })
})
