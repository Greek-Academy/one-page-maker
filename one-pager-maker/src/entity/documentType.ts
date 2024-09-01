import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { z } from "zod";
import { assertZodSchema } from "../utils/asserts.ts";

const statusSchema = z.enum(["draft", "reviewed", "final", "obsolete"]);
const privilegeSchema = z.enum(["private", "can_view", "can_edit"]);
/**
 * Firestore の Document 型のスキーマ
 */
export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  contents: z.string(),
  status: statusSchema,
  owner_id: z.string(),
  contributors: z.array(z.string()),
  reviewers: z.array(z.string()),
  url_privilege: privilegeSchema,
  deleted_at: z.instanceof(Timestamp).nullable(),
  published_at: z.instanceof(Timestamp).nullable(),
  updated_at: z.instanceof(Timestamp),
  created_at: z.instanceof(Timestamp)
});

export type Document = z.infer<typeof documentSchema>;
export type DocumentForCreate = Omit<
  Document,
  "id" | "deleted_at" | "updated_at" | "created_at"
>;
export type DocumentForUpdate = Partial<Omit<Document, "updated_at">> & {
  id: string;
};
export type Status = z.infer<typeof statusSchema>;
export const statusValues = Object.values(statusSchema.enum);
export type UrlPrivilege = z.infer<typeof privilegeSchema>;
export const urlPrivilegeValues = Object.values(privilegeSchema.enum);

export const documentConverter: FirestoreDataConverter<Document> = {
  fromFirestore(snapshot): Document {
    const data = { ...snapshot.data(), id: snapshot.id };
    assertZodSchema(documentSchema, data);
    return data;
  },
  toFirestore(modelObject) {
    // データから id を除去
    const weakenModel = Object.assign({}, modelObject);
    delete weakenModel.id;
    return weakenModel;
  }
};
