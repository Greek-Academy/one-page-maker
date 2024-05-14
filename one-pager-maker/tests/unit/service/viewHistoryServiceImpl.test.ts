import {beforeEach, describe, expect, test} from "vitest";
import {
    ViewHistoryServiceImpl
} from "../../../src/service/viewHistoryServiceImpl";
import {
    MockViewHistoryRepository
} from "../../../src/repository/mockViewHistoryRepository";
import {viewHistoryFactory} from "../../_shared/factory/viewHistoryFactory";
import {ViewHistory} from "../../../src/entity/viewHistoryType";
import {Timestamp} from "firebase/firestore";

describe('ViewHistoryServiceImpl', function () {
    const viewHistoryRepo = new MockViewHistoryRepository();
    const viewHistoryService = new ViewHistoryServiceImpl(viewHistoryRepo);
    const uid = 'uid';

    const createViewHistory = async (num: number) => {
        const result: ViewHistory[] = [];
        for (let i = 0; i < num; i++) {
            result.push(await viewHistoryRepo.create({uid, viewHistory: viewHistoryFactory.build()}));
        }
        return result;
    }

    beforeEach(() => {
        viewHistoryRepo.clear();
    })

    describe('getEditHistory()', () => {
        test('returns 1 data', async () => {
            await createViewHistory(1);
            const result = await viewHistoryService.getEditHistory({uid});

            expect(result).toHaveLength(1);
        });

        test('returns only limited data', async () => {
            await createViewHistory(10);
            const result = await viewHistoryService.getEditHistory({uid, limit: 5});

            expect(result).toHaveLength(5)
        });

        test('returns data ordered by updated_at', async () => {
            await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid});

            console.log(result)
            expect(result).toHaveLength(2);
            expect(result[0].updated_at.toMillis()).toBeGreaterThan(result[1].updated_at.toMillis());
        });

        test('returns data after lastFetched', async () => {
            const [first, second] = await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid, lastFetched: first});

            expect(result).toHaveLength(1);
            expect(result[0].updated_at).toBe(second.updated_at);
        });
    })

    describe('setEditHistory()', async () => {

    })
});
