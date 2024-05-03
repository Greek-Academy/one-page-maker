import {beforeEach, describe, expect, test} from "vitest";
import {
    MockDocumentRepository
} from "../../../src/repository/mockDocumentRepository";
import {DocumentServiceImpl} from "../../../src/service/documentServiceImpl";
import {mockDocument} from "../../../src/entity/mock";

describe('DocumentServiceImpl', () => {
    const documentRepository = new MockDocumentRepository();
    const documentService = new DocumentServiceImpl(documentRepository);

    const testUid = 'testUser';
    const testDocumentId = 'testDocument';
    const docForCreate = mockDocument.forCreate;
    const docForUpdate = mockDocument.forUpdate;

    beforeEach(() => {
        documentRepository.clear();
    })

    describe('get()', () => {
        test('returns nothing if data is empty', async () => {
            const result = await documentService.get(testUid, testDocumentId);
            expect(result).toBe(undefined);
        });

        test('returns data if data exits', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.get(testUid, createdDoc.id);
            expect(result).toMatchObject(createdDoc);
        })
    });

    describe('getMany()', () => {
        test('returns [] if data is empty', async () => {
            const result = await documentService.getMany(testUid);
            expect(result).toHaveLength(0);
        })

        test('returns certain amount of data if data exits', async () => {
            const amount = 5;

            for (let i = 0; i < amount; i++) {
                await documentRepository.create({
                    uid: testUid,
                    document: docForCreate
                });
            }

            const result = await documentService.getMany(testUid);
            expect(result).toHaveLength(amount);
        })
    });

    describe('create()', () => {
        test('returns proper data', async () => {
            const result = await documentService.create(testUid);
            expect(result).toMatchObject({
                status: 'draft',
                owner_id: testUid,
                url_privilege: 'private',
                deleted_at: null
            })
        })

        test('add data to database properly', async () => {
            await documentService.create(testUid);
            const data = await documentRepository.getMany({uid: testUid});
            expect(data).toHaveLength(1);
        })
    });

    describe('delete()', () => {
        test('returns proper data', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.delete(testUid, createdDoc);
            expect(result.deleted_at).not.toBe(null);
        })

        test('deletes data in database', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            await documentService.delete(testUid, createdDoc);
            const deletedDoc = await documentRepository.get({
                uid: testUid,
                documentId: createdDoc.id
            });
            expect(deletedDoc.deleted_at).not.toBe(null);
        })
    });

    describe('update()', () => {
        test('fails if data does not exist', () => {
            expect(documentService.update(testUid, mockDocument.doc))
                .rejects.toThrow();
        });

        test('returns proper data', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.update(testUid, {
                ...createdDoc, ...docForUpdate
            });
            expect(result.updated_at).not.toBe(createdDoc.updated_at);
        })

        test('updates data in database', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.update(testUid, {
                ...createdDoc, ...docForUpdate
            });
            const docInDB = await documentRepository.get({
                uid: testUid,
                documentId: createdDoc.id
            });
            expect(docInDB.updated_at).toBe(result.updated_at);
        })
    });

    describe('updateTitle()', function () {
        const newTitle = 'New Title';
        test('fails if data does not exist', () => {
            expect(documentService.updateTitle(testUid, mockDocument.doc, newTitle))
                .rejects.toThrow();
        });

        test('returns proper data', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.updateTitle(testUid, {
                ...createdDoc, ...docForUpdate
            }, newTitle);
            expect(result.title).toBe(newTitle);
        })

        test('updates data in database', async () => {
            const createdDoc = await documentRepository.create({
                uid: testUid,
                document: docForCreate
            });
            const result = await documentService.updateTitle(testUid, {
                ...createdDoc, ...docForUpdate
            }, newTitle);
            const docInDB = await documentRepository.get({
                uid: testUid,
                documentId: createdDoc.id
            });
            expect(docInDB.title).toBe(result.title);
        })
    });
})
