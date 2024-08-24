import { FieldValue, Timestamp } from "firebase/firestore";

export type ForCreate<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type ForCreateWithId<T> = Omit<T, "created_at" | "updated_at">;
export type ForUpdate<T extends { id: unknown }> = Partial<
  Omit<T, "created_at" | "updated_at">
> & {
  id: Pick<T, "id">["id"];
};

/**
 * 入力されたオブジェクト型のフィールドのうち, Timestamp型のフィールドのみをFieldValueに変換します.
 * T がオブジェクトではない場合, そのまま T を返します.
 */
export declare type WithTimestamp<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends Timestamp
        ? FieldValue
        : T[K] extends Timestamp | undefined
          ? FieldValue | undefined
          : T[K] extends Timestamp | null
            ? FieldValue | null
            : T[K];
    }
  : T;
