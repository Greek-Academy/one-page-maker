import {beforeEach, describe, expect, test, vi} from "vitest";
import {MockViewHistoryRepository} from "../../_shared/mock/mockViewHistoryRepository";
import {viewHistoryFactory} from "../../_shared/factory/viewHistoryFactory";
import {ViewHistory} from "../../../src/entity/viewHistoryType";
import {Timestamp} from "firebase/firestore";
import {container} from "tsyringe";
import {ViewHistoryService} from "../../../src/service/viewHistoryService";
import {DI} from "../../../src/di";
import {MockUserRepository} from "../../_shared/mock/mockUserRepository";
import {userFactory} from "../../_shared/factory/userFactory";
import {MockDocumentRepository} from "../../_shared/mock/mockDocumentRepository";
import {documentFactory} from "../../_shared/factory/documentFactory";

describe('ViewHistoryServiceImpl', function () {
    const viewHistoryService = container.resolve<ViewHistoryService>(DI.ViewHistoryService);
    const viewHistoryRepo = container.resolve<MockViewHistoryRepository>(DI.ViewHistoryRepository);
    const userRepository = container.resolve<MockUserRepository>(DI.UserRepository);
    const documentRepository  = container.resolve<MockDocumentRepository>(DI.DocumentRepository);

    const userId = 'test-user-id'
    const userUid = 'test-user-uid';
    const documentId = 'test-documentId';

    const createViewHistory = async (num: number, viewType: 'review' | 'edit' = 'edit') => {
        const result: ViewHistory[] = [];
        for (let i = 0; i < num; i++) {
            result.push(await viewHistoryRepo.create({
                uid: userUid, viewHistory: viewHistoryFactory.build({
                    viewType,
                    updated_at: Timestamp.fromMillis(Date.now() + i * 1000),
                    created_at: Timestamp.fromMillis(Date.now() + i * 1000),
                })
            }));
        }
        return result;
    }

    beforeEach(async () => {
        viewHistoryRepo.clear();
        await userRepository.create(userFactory.build({
            id: userUid, uid: userUid
        }));
        await documentRepository.create({
            uid: userUid,
            document: documentFactory.build({
                id: documentId,
            })
        });
    })

    describe('getEditHistory()', () => {
        test('returns 1 data', async () => {
            await createViewHistory(1);
            const result = await viewHistoryService.getEditHistory({uid: userUid});

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({viewType: 'edit'});
        });

        test('returns only limited data', async () => {
            await createViewHistory(10);
            const result = await viewHistoryService.getEditHistory({uid: userUid, limit: 5});

            expect(result).toHaveLength(5)
        });

        test('returns data ordered by updated_at', async () => {
            await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid: userUid, orderBy: 'desc'});

            expect(result).toHaveLength(2);
            expect(result[0].updated_at.toMillis()).toBeGreaterThan(result[1].updated_at.toMillis());
        });

        test('returns data after lastFetched', async () => {
            const [first, second] = await createViewHistory(2);
            const result = await viewHistoryService.getEditHistory({uid: userUid, lastFetched: second});

            expect(result).toHaveLength(1);
            expect(result[0].updated_at).toBe(first.updated_at);
        });
    })

    describe('getReviewHistory()', () => {
        test('returns 1 data', async () => {
            await createViewHistory(1, 'review');
            const result = await viewHistoryService.getReviewHistory({uid: userUid});

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({viewType: 'review'});
        });

        test('returns only limited data', async () => {
            await createViewHistory(10, 'review');
            const result = await viewHistoryService.getReviewHistory({uid: userUid, limit: 5});

            expect(result).toHaveLength(5)
        });

        test('returns data ordered by updated_at', async () => {
            await createViewHistory(2, 'review');
            const result = await viewHistoryService.getReviewHistory({uid: userUid});

            expect(result).toHaveLength(2);
            expect(result[0].updated_at.toMillis()).toBeGreaterThan(result[1].updated_at.toMillis());
        });

        test('returns data after lastFetched', async () => {
            const [first, second] = await createViewHistory(2, 'review');
            const result = await viewHistoryService.getReviewHistory({uid: userUid, lastFetched: second});

            expect(result).toHaveLength(1);
            expect(result[0].updated_at).toBe(first.updated_at);
        });
    });

    describe('setEditHistory()', async () => {
        test('creates a new history', async () => {
            await viewHistoryRepo.registerUser(userUid);

            const result = await viewHistoryService.setEditHistory({uid: userUid, documentId});

            expect(result.isSuccess).toBeTruthy();
            expect(result.value).toMatchObject({viewType: 'edit', documentId});
        });

        test('updates the history', async () => {
            const history = await viewHistoryRepo.create({
                uid: userUid, viewHistory: viewHistoryFactory.build({
                    documentId,
                    updated_at: Timestamp.fromMillis(Date.now() - 1000),
                })
            });
            const result = await viewHistoryService.setEditHistory({uid: userUid, documentId: history.documentId});

            expect(result.isSuccess).toBeTruthy();
            expect(result.value).toMatchObject({viewType: 'edit', documentId: history.documentId});
            expect(result.value.updated_at.toMillis()).toBeGreaterThan(history.updated_at.toMillis());
        });
    });

    describe('setReviewHistory()', async () => {
        test('creates a new history', async () => {
            await viewHistoryRepo.registerUser(userUid);
            const result = await viewHistoryService.setReviewHistory({uid: userUid, documentId});

            expect(result.isSuccess).toBeTruthy();
            expect(result.value).toMatchObject({viewType: 'review', documentId});
        });

        test('updates the history', async () => {
            const history = await viewHistoryRepo.create({
                uid: userUid, viewHistory: viewHistoryFactory.build({
                    documentId,
                    viewType: 'review',
                    updated_at: Timestamp.fromMillis(Date.now() - 1000),
                })
            });
            const result = await viewHistoryService.setReviewHistory({uid: userUid, documentId: history.documentId});

            expect(result.value).toMatchObject({viewType: 'review', documentId: history.documentId});
            expect(result.value.updated_at.toMillis()).toBeGreaterThan(history.updated_at.toMillis());
        });
    });
});
