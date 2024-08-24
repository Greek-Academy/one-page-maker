import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderByDirection } from "../repository/shared/utils.ts";
import { ViewHistory } from "../entity/viewHistoryType.ts";
import { viewHistoryService } from "./services.ts";
import { Document } from "../entity/documentType.ts";

const queryKeys = {
  reviewHistoryId: (id: string) => `review-history-id-${id}`,
  reviewHistories: "review-histories",
  editHistoryId: (id: string) => `edit-history-id-${id}`,
  editHistories: "edit-histories"
};

export const viewHistoryApi = {
  useGetEditHistoryQuery: (args: {
    uid: string;
    orderBy?: OrderByDirection;
    lastFetched?: ViewHistory;
    limit?: number;
  }) => useGetViewHistoryQuery("edit", args),
  useGetReviewHistoryQuery: (args: {
    uid: string;
    orderBy?: OrderByDirection;
    lastFetched?: ViewHistory;
    limit?: number;
  }) => useGetViewHistoryQuery("review", args),
  useSetEditHistoryMutation: () => useSetViewHistoryMutation("edit"),
  useSetReviewHistoryMutation: () => useSetViewHistoryMutation("review")
};

const useGetViewHistoryQuery = (
  type: "edit" | "review",
  args: {
    uid: string;
    orderBy?: OrderByDirection;
    lastFetched?: ViewHistory;
    limit?: number;
  }
) => {
  const queryKey = [
    type === "edit" ? queryKeys.editHistories : queryKeys.reviewHistories
  ];
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return type === "edit"
        ? await viewHistoryService.getEditHistory(args)
        : await viewHistoryService.getReviewHistory(args);
    }
  });
};

const useSetViewHistoryMutation = (type: "edit" | "review") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      uid: string;
      documentId: string;
      document?: Document;
    }) => {
      if (args.uid === "" || args.documentId === "")
        return Promise.reject(new Error("Invalid args"));
      try {
        const result =
          type === "edit"
            ? await viewHistoryService.setEditHistory(args)
            : await viewHistoryService.setReviewHistory(args);
        return result.value;
      } catch (e) {
        console.error(e);
        return Promise.reject(e);
      }
    },
    onSuccess: async (history) => {
      if (history === undefined) return;
      const queryKey = [
        type === "edit" ? queryKeys.editHistories : queryKeys.reviewHistories
      ];
      queryClient.setQueryData<ViewHistory[]>(queryKey, (old) => {
        if (old === undefined) return old;
        const hisIndex = old.findIndex((his) => his.id === history.id);
        if (hisIndex === -1) return old;
        old[hisIndex] = history;
        return old;
      });
    }
  });
};
