import { TransactionRepository } from "./transactionRepository.ts";
import { runTransaction } from "@firebase/firestore";
import { db } from "../firebase.ts";
import { FirestoreClientManager } from "./shared/firestoreClientManager.ts";
import { TransactionClient } from "./shared/transactionClient.ts";
import { dbClient } from "./shared/dbClient.ts";

export class TransactionRepositoryImpl implements TransactionRepository {
  private readonly clientManager = FirestoreClientManager.INSTANCE;

  run<T>(callback: () => Promise<T>): Promise<T> {
    return runTransaction(db, async (transaction) => {
      this.clientManager.setClient(new TransactionClient(transaction));

      try {
        return await callback();
      } catch (e) {
        return Promise.reject(e);
      } finally {
        this.clientManager.setClient(dbClient);
      }
    });
  }
}
