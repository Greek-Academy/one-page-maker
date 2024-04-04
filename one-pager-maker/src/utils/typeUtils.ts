import {Timestamp, FieldValue} from "firebase/firestore";

/**
 * 入力されたオブジェクト型のフィールドのうち, Timestamp型のフィールドのみをFieldValueに変換します.
 * T がオブジェクトではない場合, そのまま T を返します.
 */
export declare type WithTimestamp<T> = T extends object ? {
    [K in keyof T]: T[K] extends Timestamp ? FieldValue :
        T[K] extends Timestamp | undefined ? FieldValue | undefined :
            T[K] extends Timestamp | null ? FieldValue | null : T[K]
} : T;
