import { Factory } from "fishery";
import { ViewHistory } from "../../../src/entity/viewHistoryType";
import { Timestamp } from "firebase/firestore";
import { documentFactory } from "./documentFactory";

export const viewHistoryFactory = Factory.define<ViewHistory>(
  ({ sequence }) => ({
    id: `view-history-${sequence}`,
    uid: `uid-${sequence}`,
    documentId: `document-${sequence}`,
    viewType: "edit",
    document: documentFactory.build(),
    created_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000),
    updated_at: Timestamp.fromMillis(new Date().getTime() + sequence * 1000)
  })
);
