import {
    endAt,
    endBefore,
    limit,
    orderBy,
    QueryConstraint,
    startAfter,
    startAt,
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

export type QueryParams<T, K extends keyof T> = {
    orderBy?: OrderBy<T>,
    startAt?: unknown
    startAfter?: unknown
    endAt?: unknown,
    endBefore?: unknown,
    limit?: number,
    where?: WhereFilter<T, K> | WhereFilter<T, K>[]
}

/**
 * QueryParams を QueryConstraint[] に変換します
 * @param query
 */
export function buildQueryConstraints<T, K extends keyof T>(query: QueryParams<T, K>) {
    const constraints: QueryConstraint[] = [];

    if (query.orderBy && typeof query.orderBy.field === 'string') constraints.push(orderBy(query.orderBy.field, query.orderBy.direction))
    if (query.startAt) constraints.push(startAt(query.startAt))
    if (query.startAfter) constraints.push(startAfter(query.startAfter))
    if (query.endAt) constraints.push(endAt(query.endAt))
    if (query.endBefore) constraints.push(endBefore(query.endBefore))
    if (query.limit) constraints.push(limit(query.limit))

    const addWhereConstraint = (whereFilter: WhereFilter<T, K>) => {
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
