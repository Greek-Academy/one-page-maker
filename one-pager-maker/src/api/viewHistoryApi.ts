import {useMutation, useQuery} from "@tanstack/react-query";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {viewHistoryService} from "./services.ts";
import {queryClient} from "../queryClient.ts";

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
        queryKey: [queryKeys.editHistories, args.uid, args.orderBy, args.lastFetched, args.limit],
        queryFn: async () => {
            if (args.uid === "") return [];
            const result = await viewHistoryService.getEditHistory(args);
            return result;
        }
    }),
    useGetReviewHistoryQuery: (args: {
        uid: string;
        orderBy?: OrderByDirection;
        lastFetched?: ViewHistory,
        limit?: number,
    }) => useQuery({
        queryKey: [queryKeys.reviewHistories, args.uid, args.orderBy, args.lastFetched, args.limit],
        queryFn: async () => {
            if (args.uid === "") return [];
            const result = await viewHistoryService.getReviewHistory(args);
            return result;
        }
    }),
    useSetEditHistoryMutation: () => useMutation({
        mutationFn: async (args: { uid: string, documentId: string }) => {
            if (args.uid === "" || args.documentId === "") return;
            const result = await viewHistoryService.setEditHistory(args);
            return result.value;
        },
        onSuccess: async (history) => {
            if (history === undefined) return;
            await queryClient.invalidateQueries({queryKey: [queryKeys.editHistoryId(history.id), queryKeys.editHistories]})
        }
    }),
    useSetReviewHistoryMutation: () => useMutation({
        mutationFn: async (args: { uid: string, documentId: string }) => {
            if (args.uid === "" || args.documentId === "") return;
            const result = await viewHistoryService.setReviewHistory(args);
            return result.value;
        },
        onSuccess: async (history) => {
            if (history === undefined) return;
            await queryClient.invalidateQueries({queryKey: [queryKeys.reviewHistoryId(history.id), queryKeys.reviewHistories]})
        }
    }),
};
