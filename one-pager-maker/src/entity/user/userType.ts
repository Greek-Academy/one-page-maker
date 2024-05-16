import {z} from "zod";
import {FirestoreDataConverter, Timestamp} from "firebase/firestore";
import {assertZodSchema} from "../../utils/asserts.ts";

const userSchema = z.object({
    id: z.string(),
    uid: z.string(),
    photoUrl: z.string().url(),
    updated_at: z.instanceof(Timestamp),
    created_at: z.instanceof(Timestamp)
});

export type User = z.infer<typeof userSchema>;

export const userConverter: FirestoreDataConverter<User> = {
    fromFirestore(snapshot): User {
        const data = {...snapshot.data(), id: snapshot.id};
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