import {
    DocumentData,
    DocumentReference,
    DocumentSnapshot, Query, QuerySnapshot, UpdateData, WithFieldValue
} from "@firebase/firestore";

export interface FirestoreClient {
    get<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>): Promise<DocumentSnapshot<AppModel, DbModel>>;

    getMany<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>>;
    
    set<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>, data: WithFieldValue<AppModel>): Promise<void>;

    update<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>, data: UpdateData<DbModel>): Promise<void>;

    delete<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>): Promise<void>;
}
