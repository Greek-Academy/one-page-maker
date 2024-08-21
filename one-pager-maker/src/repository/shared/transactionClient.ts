import { FirestoreClient } from "./firestoreClient.ts";
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  Transaction,
  UpdateData,
  WithFieldValue
} from "@firebase/firestore";

export class TransactionClient implements FirestoreClient {
  constructor(private transaction: Transaction) {}

  delete<AppModel, DbModel extends DocumentData>(
    documentRef: DocumentReference<AppModel, DbModel>
  ): Promise<void> {
    this.transaction.delete(documentRef);
    return Promise.resolve();
  }

  get<AppModel, DbModel extends DocumentData>(
    documentRef: DocumentReference<AppModel, DbModel>
  ): Promise<DocumentSnapshot<AppModel, DbModel>> {
    return this.transaction.get(documentRef);
  }

  getMany<AppModelType, DbModelType extends DocumentData>(): Promise<
    QuerySnapshot<AppModelType, DbModelType>
  > {
    console.warn("getMany() is not supported within a transaction.");
    return Promise.reject("getMany() is not supported within a transaction.");
  }

  set<AppModel, DbModel extends DocumentData>(
    documentRef: DocumentReference<AppModel, DbModel>,
    data: WithFieldValue<AppModel>
  ): Promise<void> {
    this.transaction.set(documentRef, data);
    return Promise.resolve();
  }

  update<AppModel, DbModel extends DocumentData>(
    documentRef: DocumentReference<AppModel, DbModel>,
    data: UpdateData<DbModel>
  ): Promise<void> {
    this.transaction.update(documentRef, data);
    return Promise.resolve();
  }
}
