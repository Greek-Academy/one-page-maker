import {
    endAt,
    endBefore,
    limit,
    orderBy,
    QueryConstraint,
    startAfter,
    startAt, Timestamp,
    where
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
        constraints.push(orderBy(query.orderBy.field, query.orderBy.direction))
    }
    if (query.startAt) constraints.push(startAt(query.startAt))
    if (query.startAfter) constraints.push(startAfter(query.startAfter))
    if (query.endAt) constraints.push(endAt(query.endAt))
    if (query.endBefore) constraints.push(endBefore(query.endBefore))
    if (query.limit) constraints.push(limit(query.limit))

    const addWhereConstraint = (whereFilter: WhereFilter<T, keyof T>) => {
        if (typeof whereFilter.field === 'string')
            constraints.push(where(whereFilter.field, whereFilter.op, whereFilter.value))
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
    const key = query.orderBy.field;
    const field = val[key];
    const direction = query.orderBy.direction === 'desc' ? -1 : 1;
    if (field instanceof Timestamp && typeof field && query.startAt instanceof Timestamp) {
        const diff = field.seconds - query.startAt.seconds;
        return diff * direction > 0;
    }
    return true;
}