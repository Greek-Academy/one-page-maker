import {FirestoreDataConverter, Timestamp} from 'firebase/firestore';
import {z} from "zod";
import {assertZodSchema} from "../../utils/asserts.ts";

/**
 * Firestore の Document 型のスキーマ
 */
const documentSchema = z.object({
    id: z.string(),
    title: z.string(),
    contents: z.string(),
    status: z.enum(['draft', 'reviewed', 'final', 'obsolete']),
    ownerId: z.string(),
    contributors: z.array(z.string()),
    reviewers: z.array(z.string()),
    url_privilege: z.enum(['private', 'can_view', 'can_edit']),
    deleted_at: z.instanceof(Timestamp).nullable(),
    updated_at: z.instanceof(Timestamp),
    created_at: z.instanceof(Timestamp)
})

export type Document = z.infer<typeof documentSchema>
export type DocumentForCreate = Omit<Document, "id" | "deleted_at" | "updated_at" | "created_at">
export type DocumentForUpdate = Omit<Document, "updated_at">
export type DocumentForDelete = Omit<Document, "deleted_at">

export const documentConverter: FirestoreDataConverter<Document> = {
    fromFirestore(snapshot): Document {
        const data = {...snapshot.data(), id: snapshot.id};
        assertZodSchema(documentSchema, data);
        return data;
    },
    toFirestore(modelObject) {
        // データから id を除去
        const weakenModel = Object.assign({}, modelObject);
        delete weakenModel.id;
        return weakenModel;
    }
}
