import {useQuery} from "@tanstack/react-query";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {viewHistoryService} from "./services.ts";

const queryKeys = {
    reviewHistoryId: (id: string) => `review-history-id-${id}`,
    reviewHistories: 'review-histories',
    editHistoryId: (id: string) => `edit-history-id-${id}`,
    editHistories: 'edit-histories',
}

export const viewHistoryApi = {
    useGetEditHistoryQuery: (args: {
        uid: string;
        orderBy?: OrderByDirection;
        lastFetched?: ViewHistory,
        limit?: number,
    }) => useQuery({
        queryKey: [queryKeys.reviewHistories, args.uid, args.orderBy, args.lastFetched, args.limit],
        queryFn: async () => {
            const result = await viewHistoryService.getEditHistory(args);
            return result.values();
        }
    }),
    useGetViewHistoryQuery: (args: {
        uid: string;
        orderBy?: OrderByDirection;
        lastFetched?: ViewHistory,
        limit?: number,
    }) => useQuery({
        queryKey: [queryKeys.editHistories, args.uid, args.orderBy, args.lastFetched, args.limit],
        queryFn: async () => {
            const result = await viewHistoryService.getReviewHistory(args);
            return result.values();
        }
    }),
};
