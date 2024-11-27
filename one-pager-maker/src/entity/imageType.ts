import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { z } from "zod";
import { assertZodSchema } from "../utils/asserts.ts";

/**
 * Firestore の Image 型のスキーマ
 */
export const imageSchema = z.object({
  id: z.string(),
  owner_id: z.string(),
  document_id: z.string(),
  image_url: z.string(),
  created_at: z.instanceof(Timestamp),
  updated_at: z.instanceof(Timestamp),
  deleted_at: z.instanceof(Timestamp).nullable(),
});

export type Image = z.infer<typeof imageSchema>;
export type ImageForCreate = Omit<
  Image,
  "id" | "deleted_at" | "updated_at" | "created_at"
>;

export type ImageForUpdate = Partial<Omit<Image, "updated_at">> & {
  id: string;
};

export const imageConverter: FirestoreDataConverter<Image> = {
  fromFirestore(snapshot): Image {
    const data = { ...snapshot.data(), id: snapshot.id };
    assertZodSchema(imageSchema, data);
    return data;
  },
  toFirestore(modelObject) {
    // データから id を除去
    const weakenModel = Object.assign({}, modelObject);
    delete weakenModel.id;
    return weakenModel;
  }
};
