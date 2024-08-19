import { TransactionRepositoryImpl } from "./transactionRepositoryImpl.ts";

export const transactionRepository: TransactionRepository =
  new TransactionRepositoryImpl();

/**
 * Interface for transaction repository.
 */
export interface TransactionRepository {
  /**
   * Runs a transaction.
   * @param callback - The callback to run within the transaction.
   * @returns A promise that resolves with the result of the callback.
   */
  run<T>(callback: () => Promise<T>): Promise<T>;
}
