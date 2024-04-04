import {z, ZodType} from "zod";

/**
 * Zod で作成した Schema で型アサーションをする
 * @param schema z.object() などの Schema
 * @param value アサーションしたい値orオブジェクト
 */
export function assertZodSchema<T extends ZodType<any, any, any>>(
    schema: T,
    value: unknown
): asserts value is z.infer<T> {
    schema.parse(value);
}
