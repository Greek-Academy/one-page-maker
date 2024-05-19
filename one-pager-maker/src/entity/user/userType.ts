import {z} from "zod";
import {FirestoreDataConverter, Timestamp} from "firebase/firestore";
import {assertZodSchema} from "../../utils/asserts.ts";

export const idSchema = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]+$/);
export const photoUrlSchema = z.string().url();

const userSchema = z.object({
    id: idSchema,
    uid: z.string(),
    photoUrl: photoUrlSchema,
    updated_at: z.instanceof(Timestamp),
    created_at: z.instanceof(Timestamp)
});

export type User = z.infer<typeof userSchema>;

export const userConverter: FirestoreDataConverter<User> = {
    fromFirestore(snapshot): User {
        const data = {...snapshot.data()};
        assertZodSchema(userSchema, data);
        return data;
    },
    toFirestore(modelObject) {
        // データから id を除去
        const weakenModel = Object.assign({}, modelObject);
        delete weakenModel.id;
        return weakenModel;
    }
}
