import { beforeAll, beforeEach, describe, test, expect } from "vitest";
import { UserRepositoryImpl } from "../../../src/repository/userRepositoryImpl";
import {
  deleteFirestoreEmulatorData,
  useFirestoreEmulator
} from "../firebaseEmulatorUtils";
import { userFactory } from "../../_shared/factory/userFactory";

describe("UserRepositoryImpl Test", () => {
  const repository = new UserRepositoryImpl();

  beforeAll(() => useFirestoreEmulator());

  beforeEach(async () => {
    await deleteFirestoreEmulatorData();
  });

  describe("create()", function () {
    test("id field become primary key", async () => {
      const id = "test";
      await repository.create(
        userFactory.build({
          id
        })
      );
      const result = await repository.findUnique(id);
      expect(result).toBeDefined();
      expect(result).toHaveProperty("id", id);
    });
  });

  describe("findMany()", function () {
    test("should query by document id", async () => {
      const id = "abcde";
      for (let i = 0; i < 5; i++) {
        await repository.create(
          userFactory.build({
            id: id.slice(0, i + 1)
          })
        );
      }
      const result = await repository.findMany({
        orderBy: {
          field: "id",
          direction: "asc"
        },
        startAt: "abc",
        endAt: "abc\uf8ff"
      });

      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "abc"
          }),
          expect.objectContaining({
            id: "abcd"
          }),
          expect.objectContaining({
            id: "abcde"
          })
        ])
      );
    });

    test("should query by empty document id", async () => {
      const id = "ubY1R56xnNcHzptUcTUQmVpPBXz1";
      await repository.create(
        userFactory.build({
          id
        })
      );
      const result = await repository.findMany({
        orderBy: {
          field: "id",
          direction: "asc"
        },
        startAt: "",
        endAt: "\uf8ff"
      });

      expect(result).toHaveLength(1);
    });
  });
});
