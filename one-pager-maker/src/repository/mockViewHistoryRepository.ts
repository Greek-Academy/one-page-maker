import {ViewHistoryRepository} from "./viewHistoryRepository.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {filterByQuery, QueryParams, sortByQuery} from "./shared/utils.ts";
import {MockDBRepository} from "./shared/mockDBRepository.ts";

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
            .sort((a, b) => sortByQuery(a, b, query))
            .filter((val) => filterByQuery(val, query))
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
