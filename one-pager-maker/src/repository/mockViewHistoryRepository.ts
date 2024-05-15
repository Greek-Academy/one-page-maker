import {ViewHistoryRepository} from "./viewHistoryRepository.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {QueryParams} from "./shared/utils.ts";
import {MockDBRepository} from "./shared/mockDBRepository.ts";
import {Timestamp} from "firebase/firestore";

export class MockViewHistoryRepository implements ViewHistoryRepository {
    private readonly mock = new MockDBRepository<ViewHistory>();

    clear() {
        this.mock.clear();
    }

    create(args: {
        uid: string;
        viewHistory: ViewHistory
    }): Promise<ViewHistory> {
        return this.mock.create({uid: args.uid, data: {
            ...args.viewHistory,
            }});
    }

    async delete(args: { uid: string; viewHistoryId: string }): Promise<void> {
        await this.mock.delete({uid: args.uid, id: args.viewHistoryId});
    }

    get(args: {
        uid: string;
        viewHistoryId: string
    }): Promise<ViewHistory | null> {
        return this.mock.get({uid: args.uid, dataId: args.viewHistoryId});
    }

    getMany(args: {
        uid: string
    }, query: QueryParams<ViewHistory>): Promise<ViewHistory[]> {
        const map = this.mock.getAll();
        const histories = map.get(args.uid);

        if (histories === undefined) {
            return Promise.reject(`User ${args.uid} not found`);
        }

        const queryResult = histories
            .sort((a, b) => {
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
            })
            .filter((val) => {
                if (query.orderBy === undefined) return true;
                const key = query.orderBy.field;
                const field = val[key];
                const direction = query.orderBy.direction === 'desc' ? -1 : 1;
                if (field instanceof Timestamp && typeof field && query.startAt instanceof Timestamp) {
                    const diff = field.seconds - query.startAt.seconds;
                    return diff * direction > 0;
                }
                return true;
            })
            .slice(0, query.limit);
        return Promise.resolve(queryResult);
    }

    async update(args: {
        uid: string;
        viewHistory: ViewHistory
    }): Promise<void> {
        await this.mock.update({uid: args.uid, data: args.viewHistory});
    }

}
