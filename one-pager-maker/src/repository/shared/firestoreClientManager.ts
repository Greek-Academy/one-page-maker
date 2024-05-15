import {FirestoreClient} from "./firestoreClient.ts";
import {dbClient} from "./dbClient.ts";

/**
 * Singleton class to manage Firestore client.
 */
export class FirestoreClientManager {
    static readonly INSTANCE = new FirestoreClientManager();

    private client: FirestoreClient = dbClient;

    setClient(client: FirestoreClient): void {
        this.client = client;
    }

    getClient() {
        return this.client;
    }
}
