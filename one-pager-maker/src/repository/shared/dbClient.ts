import {FirestoreClient} from "./firestoreClient.ts";
import {
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    Query,
    QuerySnapshot,
    UpdateData,
    WithFieldValue
} from "@firebase/firestore";
import {
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc
} from "firebase/firestore";

export class DBClient implements FirestoreClient {
    delete<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>): Promise<void> {
        return deleteDoc(documentRef);
    }

    get<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>): Promise<DocumentSnapshot<AppModel, DbModel>> {
        return getDoc(documentRef);
    }

    getMany<AppModelType, DbModelType extends DocumentData>(query: Query<AppModelType, DbModelType>): Promise<QuerySnapshot<AppModelType, DbModelType>> {
        return getDocs(query);
    }

    set<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>, data: WithFieldValue<AppModel>): Promise<void> {
        return setDoc(documentRef, data);
    }

    update<AppModel, DbModel extends DocumentData>(documentRef: DocumentReference<AppModel, DbModel>, data: UpdateData<DbModel>): Promise<void> {
        return updateDoc(documentRef, data);
    }

}

export const dbClient = new DBClient();
