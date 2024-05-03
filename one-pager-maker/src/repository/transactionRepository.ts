import {TransactionRepositoryImpl} from "./transactionRepositoryImpl.ts";

export const transactionRepository: TransactionRepository = new TransactionRepositoryImpl();

export interface TransactionRepository {
    run<T>(callback: () => Promise<T>): Promise<T>;
}
