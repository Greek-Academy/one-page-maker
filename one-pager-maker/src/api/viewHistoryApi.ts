import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {OrderByDirection} from "../repository/shared/utils.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {viewHistoryService} from "./services.ts";
import {Document} from "../entity/documentType.ts";

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
        queryKey: [queryKeys.editHistories],
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
        queryKey: [queryKeys.reviewHistories],
        queryFn: async () => {
            if (args.uid === "") return [];
            const result = await viewHistoryService.getReviewHistory(args);
            return result;
        }
    }),
    useSetEditHistoryMutation: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (args: { uid: string, documentId: string, document?: Document }) => {
                if (args.uid === "" || args.documentId === "")
                    return Promise.reject(new Error("Invalid args"));
                try {
                    const result = await viewHistoryService.setEditHistory(args);
                    return result.value;
                } catch (e) {
                    console.error(e);
                    return Promise.reject(e);
                }
            },
            onSuccess: async (history) => {
                if (history === undefined) return;
                // queryClient.setQueryData([queryKeys.editHistoryId(history.id)], history);
                queryClient.setQueryData<ViewHistory[]>([queryKeys.editHistories], (old) => {
                    if (old === undefined) return old;
                    const hisIndex = old.findIndex(his => his.id === history.id);
                    if (hisIndex === -1) return old;
                    old[hisIndex] = history;
                    return old;
                });
                // await queryClient.refetchQueries({queryKey: [, queryKeys.editHistories]})
            }
        })
    },
    useSetReviewHistoryMutation: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (args: { uid: string, documentId: string, document?: Document }) => {
                if (args.uid === "" || args.documentId === "") return;
                const result = await viewHistoryService.setReviewHistory(args);
                return result.value;
            },
            onSuccess: async (history) => {
                if (history === undefined) return;
                await queryClient.invalidateQueries({queryKey: [queryKeys.reviewHistoryId(history.id), queryKeys.reviewHistories]})
            }
        })
    },
};
