import {ForCreate, ForUpdate} from "../entity/utils.ts";
import {ViewHistory} from "../entity/viewHistoryType.ts";
import {ViewHistoryRepositoryImpl} from "./viewHistoryRepositoryImpl.ts";
import {QueryParams} from "./shared/utils.ts";

export const viewHistoryRepository: ViewHistoryRepository = new ViewHistoryRepositoryImpl();

export interface ViewHistoryRepository {
    create(args: {uid: string, viewHistory: ForCreate<ViewHistory>}): Promise<ViewHistory>;

    get(args: {uid: string, viewHistoryId: string}): Promise<ViewHistory | null>;

    getMany<K extends keyof ViewHistory>(args: {uid: string}, query: QueryParams<ViewHistory, K>): Promise<ViewHistory[]>;

    update(args: {uid: string, viewHistory: ForUpdate<ViewHistory>}): Promise<ViewHistory>;

    delete(args: {uid: string, viewHistoryId: string}): Promise<void>;
}
