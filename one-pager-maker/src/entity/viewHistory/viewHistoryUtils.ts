import { ViewHistory } from "@/entity/viewHistoryType.ts";
import { Document } from "@/entity/documentType.ts";

export const toUndeletedDocuments = (
  viewHistories: ViewHistory[]
): Document[] => {
  return viewHistories
    .map((viewHistory) => ({
      ...viewHistory.document,
      path: viewHistory.document.path ?? "",
      filename: viewHistory.document.filename ?? "",
      published_at: viewHistory.document.published_at ?? null
    }))
    .filter((document) => document.deleted_at === null);
};
