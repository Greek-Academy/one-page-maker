import { beforeEach, describe, expect, test } from "vitest";
import { MockDocumentRepository } from "../../_shared/mock/mockDocumentRepository";
import { DocumentServiceImpl } from "../../../src/service/documentServiceImpl";
import { mockDocument } from "../../../src/entity/mock";
import { container } from "tsyringe";
import { DI } from "../../../src/di";

describe("DocumentServiceImpl", () => {
  const documentRepository = container.resolve<MockDocumentRepository>(
    DI.DocumentRepository
  );
  const documentService = container.resolve<DocumentServiceImpl>(
    DI.DocumentService
  );

  const uid = "testUser";
  const documentId = "testDocument";
  const docForCreate = mockDocument.forCreate;
  const docForUpdate = mockDocument.forUpdate;

  beforeEach(() => {
    documentRepository.clear();
  });

  describe("get()", () => {
    test("returns nothing if data is empty", async () => {
      const result = await documentService.getDocument({ uid, documentId });
      expect(result.value).toBe(undefined);
    });

    test("returns data if data exits", async () => {
      const createdDoc = await documentRepository.create({
        uid: uid,
        document: docForCreate
      });
      const result = await documentService.getDocument({
        uid,
        documentId: createdDoc.id
      });
      expect(result.value).toMatchObject(createdDoc);
    });
  });

  describe("create()", () => {
    test("returns proper data", async () => {
      const result = await documentService.createDocument(uid);
      expect(result).toMatchObject({
        status: "draft",
        owner_id: uid,
        url_privilege: "private",
        deleted_at: null
      });
    });

    test("add data to database properly", async () => {
      await documentService.createDocument(uid);
      const data = await documentRepository.getMany({ uid: uid });
      expect(data).toHaveLength(1);
    });
  });

  describe("delete()", () => {
    test("returns proper data", async () => {
      const createdDoc = await documentRepository.create({
        uid: uid,
        document: docForCreate
      });
      const result = await documentService.deleteDocument({
        uid,
        documentId: createdDoc.id
      });
      expect(result.deleted_at).not.toBe(null);
    });

    test("deletes data in database", async () => {
      const createdDoc = await documentRepository.create({
        uid: uid,
        document: docForCreate
      });
      await documentService.deleteDocument({ uid, documentId: createdDoc.id });
      const deletedDoc = await documentRepository.get({
        uid: uid,
        documentId: createdDoc.id
      });
      expect(deletedDoc.deleted_at).not.toBe(null);
    });
  });

  describe("update()", () => {
    test("fails if data does not exist", () => {
      expect(
        documentService.updateDocument(uid, {
          id: documentId,
          title: "test"
        })
      ).rejects.toThrow();
    });

    test("returns proper data", async () => {
      const createdDoc = await documentRepository.create({
        uid: uid,
        document: docForCreate
      });
      const result = await documentService.updateDocument(uid, {
        ...createdDoc,
        ...docForUpdate
      });
      expect(result.updated_at).not.toBe(createdDoc.updated_at);
    });

    test("updates data in database", async () => {
      const createdDoc = await documentRepository.create({
        uid: uid,
        document: docForCreate
      });
      const result = await documentService.updateDocument(uid, {
        ...createdDoc,
        ...docForUpdate
      });
      const docInDB = await documentRepository.get({
        uid: uid,
        documentId: createdDoc.id
      });
      expect(docInDB.updated_at).toBe(result.updated_at);
    });
  });
});
