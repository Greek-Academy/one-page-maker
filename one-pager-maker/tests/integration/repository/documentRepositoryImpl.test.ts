import {beforeAll, beforeEach, describe, expect, test} from "vitest";
import {
    deleteFirestoreEmulatorData,
    useFirestoreEmulator
} from "../firebaseEmulatorUtils";
import {
    DocumentRepositoryImpl
} from "../../../src/repository/documentRepositoryImpl";
import {db} from "../../../src/firebase";
import {doc, getDoc} from "firebase/firestore";
import {mockDocument} from "../../../src/entity/mock";

describe("DocumentRepositoryImpl Test", () => {
    const documentRepository = new DocumentRepositoryImpl();

    const docForCreate = mockDocument.forCreate;

    const testUid = 'testUser';

    beforeAll(() => useFirestoreEmulator());

    beforeEach(() => deleteFirestoreEmulatorData());

    describe('create()', function () {
        test("returns correct data", async () => {
            const result = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });

            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('created_at');
            expect(result).toHaveProperty('updated_at');
            expect(result).toMatchObject(docForCreate);
            expect(result).toMatchObject({deleted_at: null});
        })

        test("add data to db properly", async () => {
            const result = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });

            const docRef = doc(db, `users/${testUid}/documents/${result.id}`);
            const snapshot = await getDoc(docRef);

            expect(snapshot.exists()).toBe(true);
        })
    });

    describe('update()', function () {
        test('fails if data does not exist', () => {
            expect(documentRepository.update({
                uid: testUid,
                document: docForCreate
            })).rejects.toThrow();
        })
    });
})
