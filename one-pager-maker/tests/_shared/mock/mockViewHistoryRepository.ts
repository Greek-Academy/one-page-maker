import {ViewHistoryRepository} from "../../../src/repository/viewHistoryRepository";
import {ViewHistory} from "../../../src/entity/viewHistoryType";
import {filterByQuery, QueryParams, sortByQuery} from "../../../src/repository/shared/utils";
import {MockDBRepository} from "../../../src/repository/shared/mockDBRepository";
import {singleton} from "tsyringe";

@singleton()
export class MockViewHistoryRepository implements ViewHistoryRepository {
    private readonly mock = new MockDBRepository<ViewHistory>();

    clear() {
        this.mock.clear();
    }

    async registerUser(uid: string) {
        await this.mock.create({uid: uid, data: {id: 'tmp'}});
        await this.mock.delete({uid: uid, id: 'tmp'})
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
            return Promise.reject(new MockViewHistoryRepositoryError(`User ${args.uid} not found`));
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

class MockViewHistoryRepositoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MockViewHistoryRepositoryError';
    }
}
