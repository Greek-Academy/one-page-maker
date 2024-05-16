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

    const createViewHistory = async (num: number, viewType: 'review' | 'edit' = 'edit') => {
        const result: ViewHistory[] = [];
        for (let i = 0; i < num; i++) {
            result.push(await viewHistoryRepo.create({uid, viewHistory: viewHistoryFactory.build({
                    viewType,
                    updated_at: Timestamp.fromMillis(Date.now() + i * 1000),
                    created_at: Timestamp.fromMillis(Date.now() + i * 1000),
                })}));
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
            expect(result[0]).toMatchObject({viewType: 'edit'});
        });

        test('returns only limited data', async () => {
            await createViewHistory(10);
            const result = await viewHistoryService.getEditHistory({uid, limit: 5});

            expect(result).toHaveLength(5)
        });

        test('returns data ordered by updated_at', async () => {
            await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid, orderBy: 'desc'});

            expect(result).toHaveLength(2);
            expect(result[0].updated_at.toMillis()).toBeGreaterThan(result[1].updated_at.toMillis());
        });

        test('returns data after lastFetched', async () => {
            const [first, second] = await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid, lastFetched: second});

            expect(result).toHaveLength(1);
            expect(result[0].updated_at).toBe(first.updated_at);
        });
    })

    describe('getReviewHistory()', () => {
        test('returns 1 data', async () => {
            await createViewHistory(1, 'review');
            const result = await viewHistoryService.getReviewHistory({uid});

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({viewType: 'review'});
        });

        test('returns only limited data', async () => {
            await createViewHistory(10, 'review');
            const result = await viewHistoryService.getReviewHistory({uid, limit: 5});

            expect(result).toHaveLength(5)
        });

        test('returns data ordered by updated_at', async () => {
            await createViewHistory(2, 'review');
            const result = await viewHistoryService.getReviewHistory({uid});

            expect(result).toHaveLength(2);
            expect(result[0].updated_at.toMillis()).toBeGreaterThan(result[1].updated_at.toMillis());
        });

        test('returns data after lastFetched', async () => {
            const [first, second] = await createViewHistory(2, 'review');
            const result = await viewHistoryService.getReviewHistory({uid, lastFetched: second});

            expect(result).toHaveLength(1);
            expect(result[0].updated_at).toBe(first.updated_at);
        });
    });

    describe('setEditHistory()', async () => {
        test('creates a new history', async () => {
            const [created] = await createViewHistory(1, 'review');
            await viewHistoryRepo.delete({uid, viewHistoryId: created.id});
            const documentId = 'documentId';
            const result = await viewHistoryService.setEditHistory({uid, documentId});

            expect(result).toMatchObject({viewType: 'edit', documentId});
        });

        test('updates the history', async () => {
            const history = await viewHistoryRepo.create({uid, viewHistory: viewHistoryFactory.build({
                    updated_at: Timestamp.fromMillis(Date.now() - 1000),
                })
            });
            const result = await viewHistoryService.setEditHistory({uid, documentId: history.documentId});

            expect(result).toMatchObject({viewType: 'edit', documentId: history.documentId});
            expect(result.updated_at.toMillis()).toBeGreaterThan(history.updated_at.toMillis());
        });
    });

    describe('setReviewHistory()', async () => {
        test('creates a new history', async () => {
            const [created] = await createViewHistory(1, 'edit');
            await viewHistoryRepo.delete({uid, viewHistoryId: created.id});
            const documentId = 'documentId';
            const result = await viewHistoryService.setReviewHistory({uid, documentId});

            expect(result).toMatchObject({viewType: 'review', documentId});
        });

        test('updates the history', async () => {
            const history = await viewHistoryRepo.create({uid, viewHistory: viewHistoryFactory.build({
                    viewType: 'review',
                    updated_at: Timestamp.fromMillis(Date.now() - 1000),
                })
            });
            const result = await viewHistoryService.setReviewHistory({uid, documentId: history.documentId});

            expect(result).toMatchObject({viewType: 'review', documentId: history.documentId});
            expect(result.updated_at.toMillis()).toBeGreaterThan(history.updated_at.toMillis());
        });
    });
});
