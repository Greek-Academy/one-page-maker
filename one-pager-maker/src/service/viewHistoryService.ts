import {ViewHistory} from "../entity/viewHistoryType.ts";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {ViewHistoryServiceImpl} from "./viewHistoryServiceImpl.ts";
import {viewHistoryRepository} from "../repository/viewHistoryRepository.ts";

export const viewHistoryService: ViewHistoryService = new ViewHistoryServiceImpl(viewHistoryRepository);

export interface ViewHistoryService {
    getEditHistory(args: {
        uid: string,
        orderBy: OrderByDirection,
        lastFetched: ViewHistory
    }): Promise<ViewHistory[]>;

    getReviewHistory(args: {
        uid: string,
        orderBy: OrderByDirection,
        lastFetched: ViewHistory
    }): Promise<ViewHistory[]>;

    setEditHistory(args: {
        uid: string,
        documentId: string
    }): Promise<ViewHistory>;

    setReviewHistory(args: {
        uid: string,
        documentId: string
    }): Promise<ViewHistory>;
}
