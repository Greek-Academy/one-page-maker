import {beforeEach, describe, expect, test} from "vitest";
import {
    MockViewHistoryRepository
} from "../../../src/repository/mockViewHistoryRepository";
import {viewHistoryFactory} from "../../_shared/factory/viewHistoryFactory";

describe('MockViewHistoryRepository', () => {
    const mockViewHistoryRepository = new MockViewHistoryRepository();
    const uid = 'uid';

    beforeEach(() => {
        mockViewHistoryRepository.clear();
    });

    describe('getMany()', () => {
        test('returns histories', async () => {
            const viewHistory = viewHistoryFactory.build();
            await mockViewHistoryRepository.create({uid, viewHistory});
            const result = await mockViewHistoryRepository.getMany({uid}, {});
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject(viewHistory);
        });

        test('startAt query works correctly', async () => {
            const viewHistory1 = viewHistoryFactory.build();
            const viewHistory2 = viewHistoryFactory.build();
            await mockViewHistoryRepository.create({uid, viewHistory: viewHistory1});
            await mockViewHistoryRepository.create({uid, viewHistory: viewHistory2});
            const result = await mockViewHistoryRepository.getMany({uid}, {
                orderBy: {
                    field: 'updated_at',
                    direction: 'desc'
                },
                startAt: viewHistory2.updated_at
            });
            expect(result).toHaveLength(1);
            // 古い方 (viewHistory1) が先に来る
            expect(result[0].id).toBe(viewHistory1.id);
        });
    })
})
