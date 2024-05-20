import {ViewHistoryService} from "./viewHistoryService.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {ViewHistoryRepository} from "../repository/viewHistoryRepository.ts";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {Timestamp} from "firebase/firestore";
import {inject, injectable} from "tsyringe";
import {DI} from "../di.ts";

@injectable()
export class ViewHistoryServiceImpl implements ViewHistoryService {
    constructor(
        @inject(DI.ViewHistoryRepository) private viewHistoryRepository: ViewHistoryRepository,
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
            where: {
                field: 'viewType',
                op: '==',
                value: viewType
            },
            limit,
        });
    }

    private async setViewHistory(viewType: 'edit' | 'review', {
        uid,
        documentId
    }: {
        uid: string;
        documentId: string
    }): Promise<ViewHistory> {
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
            return this.viewHistoryRepository.create({
                uid, viewHistory: {
                    documentId, viewType
                }
            });
        }

        const oldHistory = queryResult[0];

        try {
            // 既に存在するなら updated_at のみ更新する
            await this.viewHistoryRepository.update({
                uid, viewHistory: {
                    id: oldHistory.id,
                }
            });

            return {...oldHistory, updated_at: Timestamp.now()};
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
    }): Promise<ViewHistory> {
        return this.setViewHistory('edit', args);
    }

    setReviewHistory(args: {
        uid: string;
        documentId: string
    }): Promise<ViewHistory> {
        return this.setViewHistory('review', args);
    }
}
