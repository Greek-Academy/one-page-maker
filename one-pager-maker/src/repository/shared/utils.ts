import {
    endAt,
    endBefore,
    limit,
    orderBy,
    QueryConstraint,
    startAfter,
    startAt, Timestamp,
    where, documentId
} from "firebase/firestore";

export type OrderByDirection = 'asc' | 'desc';
export type OrderBy<T> = {
    field: keyof T,
    direction: OrderByDirection
}

export type WhereFilter<T, K extends keyof T> = {
    field: K,
    op: WhereFilterOp,
    value: T[K],
}
type WhereFilterOp =
    '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';

export type QueryParams<T> = {
    orderBy?: OrderBy<T>,
    startAt?: unknown
    startAfter?: unknown
    endAt?: unknown,
    endBefore?: unknown,
    limit?: number,
    where?: WhereFilter<T, keyof T> | WhereFilter<T, keyof T>[]
}

/**
 * QueryParams を QueryConstraint[] に変換します
 * @param query
 */
export function buildQueryConstraints<T>(query: QueryParams<T>) {
    const constraints: QueryConstraint[] = [];

    if (query.orderBy && typeof query.orderBy.field === 'string') {
        const field = query.orderBy.field;
        // field が 'id' の場合は documentId() を使用する
        constraints.push(orderBy(field === 'id' ? documentId() : field, query.orderBy.direction))
    }
    if (query.startAt) constraints.push(startAt(query.startAt))
    if (query.startAfter) constraints.push(startAfter(query.startAfter))
    if (query.endAt) constraints.push(endAt(query.endAt))
    if (query.endBefore) constraints.push(endBefore(query.endBefore))
    if (query.limit) constraints.push(limit(query.limit))

    const addWhereConstraint = (whereFilter: WhereFilter<T, keyof T>) => {
        if (typeof whereFilter.field === 'string') {
            const field = whereFilter.field;
            constraints.push(where(field === 'id' ? documentId() : field, whereFilter.op, whereFilter.value))
        }
    }

    if (query.where instanceof Array) {
        for (const whereFilter of query.where) {
            addWhereConstraint(whereFilter);
        }
    } else {
        if (query.where) addWhereConstraint(query.where);
    }

    return constraints;
}

export const sortByQuery = <T>(a: T, b: T, query: QueryParams<T>): number => {
    if (query.orderBy === undefined) return 1;
    const aVal = a[query.orderBy.field];
    const bVal = b[query.orderBy.field];
    const sortOrder = query.orderBy.direction === "asc" ? 1 : -1;

    if (aVal instanceof Timestamp && bVal instanceof Timestamp) {
        return sortOrder * (aVal.nanoseconds - bVal.nanoseconds) > 0 ? 1 : -1;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal > bVal ? 1 : -1;
    }

    return 1;
}

export const filterByQuery = <T>(val: T, query: QueryParams<T>): boolean => {
    if (query.orderBy === undefined) return true;

    let shouldContain = true;

    const key = query.orderBy.field;
    const field = val[key];
    const direction = query.orderBy.direction === 'desc' ? -1 : 1;
    if (field instanceof Timestamp && typeof field && query.startAt instanceof Timestamp) {
        const diff = field.seconds - query.startAt.seconds;
        shouldContain &&= diff * direction > 0;
    }

    if (typeof field === 'string') {
        // 開始点を含まない
        if (typeof query.startAfter === 'string') {
            shouldContain &&= field > query.startAfter;
        }

        if (typeof query.endBefore === 'string') {
            shouldContain &&= field < query.endBefore;
        }

        // 開始点を含む
        if (typeof query.startAt === 'string') {
            shouldContain &&= field >= query.startAt;
        }

        if (typeof query.endAt === 'string') {
            shouldContain &&= field <= query.endAt;
        }
    }

    return shouldContain;
}
