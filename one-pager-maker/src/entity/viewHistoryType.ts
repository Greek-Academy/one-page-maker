import {z} from "zod";
import {FirestoreDataConverter, Timestamp} from "firebase/firestore";
import {assertZodSchema} from "../utils/asserts.ts";

const viewTypeSchema = z.enum(['edit', 'review']);

const viewHistorySchema = z.object({
    id: z.string(),
    documentId: z.string(),
    viewType: viewTypeSchema,
    updated_at: z.instanceof(Timestamp),
    created_at: z.instanceof(Timestamp)
});

export type ViewHistory = z.infer<typeof viewHistorySchema>;

export const viewTypeValues = Object.values(viewTypeSchema.enum);
export type ViewType = z.infer<typeof viewTypeSchema>;

export const viewHistoryConverter: FirestoreDataConverter<ViewHistory> = {
    fromFirestore(snapshot): ViewHistory {
        const data = {...snapshot.data(), id: snapshot.id};
        assertZodSchema(viewHistorySchema, data);
        return data;
    },
    toFirestore(modelObject) {
        // データから id を除去
        const weakenModel = Object.assign({}, modelObject);
        delete weakenModel.id;
        return weakenModel;
    }
}
