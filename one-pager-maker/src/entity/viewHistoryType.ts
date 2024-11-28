import { z } from "zod";
import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { assertZodSchema } from "../utils/asserts.ts";
import { documentSchema, Document } from "./documentType.ts";

const viewTypeSchema = z.enum(["edit", "review"]);

const viewHistorySchema = z.object({
  id: z.string(),
  uid: z.string(),
  documentId: z.string(),
  viewType: viewTypeSchema,
  document: documentSchema,
  updated_at: z.instanceof(Timestamp),
  created_at: z.instanceof(Timestamp)
});

export type ViewHistory = z.infer<typeof viewHistorySchema>;

export const viewTypeValues = Object.values(viewTypeSchema.enum);
export type ViewType = z.infer<typeof viewTypeSchema>;

export const viewHistoryConverter: FirestoreDataConverter<ViewHistory> = {
  fromFirestore(snapshot): ViewHistory {
    const data = snapshot.data();
    const id = snapshot.id;

    // Document オブジェクトのデフォルト値を設定
    const defaultDocument: Partial<Document> = {
      path: "",
      filename: "",
      published_at: null
    };

    // Document オブジェクトをマージ
    const mergedDocument = {
      ...defaultDocument,
      ...(data.document as Partial<Document>)
    };

    // マージした Document オブジェクトで data を更新
    const updatedData = {
      ...data,
      id,
      document: documentSchema.parse(mergedDocument)
    };

    assertZodSchema(viewHistorySchema, updatedData);
    return updatedData;
  },
  toFirestore(modelObject) {
    const weakenModel = { ...modelObject };
    delete weakenModel.id;
    return weakenModel;
  }
};
