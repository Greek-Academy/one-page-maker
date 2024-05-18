import {ViewHistory} from "../entity/viewHistoryType.ts";
import {OrderByDirection} from "../repository/shared/utils.ts";

export interface ViewHistoryService {
    /**
     * 編集履歴を更新順で limit 件だけ取得します.
     * lastFetched を入力すると, それ以降または以前に更新された履歴から取得します.
     * @param args
     */
    getEditHistory(args: {
        uid: string,
        orderBy?: OrderByDirection,
        lastFetched?: ViewHistory,
        limit?: number,
    }): Promise<ViewHistory[]>;

    /**
     * レビュー履歴を更新順で limit 件だけ取得します.
     * lastFetched を入力すると, それ以降または以前に更新された履歴から取得します.
     * @param args
     */
    getReviewHistory(args: {
        uid: string,
        orderBy?: OrderByDirection,
        lastFetched?: ViewHistory,
        limit?: number,
    }): Promise<ViewHistory[]>;

    /**
     * 編集履歴をセットします.
     * @param args
     */
    setEditHistory(args: {
        uid: string,
        documentId: string
    }): Promise<ViewHistory>;

    /**
     * レビュー履歴をセットします.
     * @param args
     */
    setReviewHistory(args: {
        uid: string,
        documentId: string
    }): Promise<ViewHistory>;
}
