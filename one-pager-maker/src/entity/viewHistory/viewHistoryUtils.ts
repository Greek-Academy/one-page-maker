import { ViewHistory } from "@/entity/viewHistoryType.ts";
import { Document } from "@/entity/documentType.ts";

export const toUndeletedDocuments = (
  viewHistories: ViewHistory[]
): Document[] => {
  return viewHistories
    .map((viewHistory) => viewHistory.document)
    .filter((document) => document.deleted_at === null);
};
