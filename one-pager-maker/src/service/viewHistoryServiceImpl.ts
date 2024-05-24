import {ViewHistoryService, ViewHistoryServiceError} from "./viewHistoryService.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {ViewHistoryRepository} from "../repository/viewHistoryRepository.ts";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {Timestamp} from "firebase/firestore";
import {inject, injectable} from "tsyringe";
import {DI} from "../di.ts";
import {Result} from "result-type-ts";
import {DocumentRepository} from "../repository/documentRepository.ts";
import {UserDomainService} from "../domain_service/userDomainService.ts";

@injectable()
export class ViewHistoryServiceImpl implements ViewHistoryService {
    constructor(
        @inject(DI.ViewHistoryRepository) private viewHistoryRepository: ViewHistoryRepository,
        @inject(DI.DocumentRepository) private documentRepository: DocumentRepository,
        @inject(DI.UserDomainService) private userDomainService: UserDomainService,
    ) {
    }

    private getViewHistory(viewType: 'edit' | 'review', {
        uid,
        orderBy = 'desc',
        lastFetched,
        limit = 10,
    }: {
        uid: string;
        orderBy?: OrderByDirection;
        lastFetched?: ViewHistory,
        limit?: number,
    }) {
        return this.viewHistoryRepository.getMany({uid}, {
            orderBy: {
                field: 'updated_at',
                direction: orderBy
            },
            startAt: lastFetched?.updated_at,
            where: [
                {
                    field: 'viewType',
                    op: '==',
                    value: viewType
                },
                {
                    field: 'document.deleted_at',
                    op: '==',
                    value: null,
                }
            ],
            limit,
        });
    }

    private async setViewHistory(viewType: 'edit' | 'review', {
        uid,
        documentId
    }: {
        uid: string;
        documentId: string
    }): Promise<Result<ViewHistory, ViewHistoryServiceError>> {
        // check if user exists
        const userExists = await this.userDomainService.exists(uid);
        if (!userExists) {
            return Result.failure(new ViewHistoryServiceError('User not found', 'user-not-found'));
        }

        // check if document exists
        const document = await this.documentRepository.get({uid, documentId});
        if (document === null) {
            return Result.failure(new ViewHistoryServiceError('Document not found', 'document-not-found'));
        }

        // documentID と viewType が一致する ViewHistory を 1 件取得する
        const queryResult = await this.viewHistoryRepository.getMany({uid}, {
            where: [
                {field: 'documentId', op: '==', value: documentId,},
                {field: 'viewType', op: '==', value: viewType,}
            ],
            limit: 1,
        });

        // まだ ViewHistory が存在しないならば
        if (queryResult.length === 0) {
            // ViewHistory を新規作成する
            const newHistory = await this.viewHistoryRepository.create({
                uid, viewHistory: {
                    documentId, viewType, uid, document
                }
            });
            return Result.success(newHistory);
        }

        const oldHistory = queryResult[0];

        try {
            // 既に存在するなら updated_at のみ更新する
            await this.viewHistoryRepository.update({
                uid, viewHistory: {
                    id: oldHistory.id,
                }
            });

            return Result.success({...oldHistory, updated_at: Timestamp.now()});
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getEditHistory(args: {
        uid: string;
        orderBy?: OrderByDirection;
        lastFetched?: ViewHistory,
        limit?: number,
    }): Promise<ViewHistory[]> {
        try {
            return await this.getViewHistory('edit', args);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getReviewHistory(args: {
        uid: string;
        orderBy?: OrderByDirection,
        lastFetched?: ViewHistory,
        limit?: number,
    }): Promise<ViewHistory[]> {
        try {
            return await this.getViewHistory('review', args);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    setEditHistory(args: {
        uid: string;
        documentId: string
    }): Promise<Result<ViewHistory, ViewHistoryServiceError>> {
        return this.setViewHistory('edit', args);
    }

    setReviewHistory(args: {
        uid: string;
        documentId: string
    }): Promise<Result<ViewHistory, ViewHistoryServiceError>> {
        return this.setViewHistory('review', args);
    }
}
