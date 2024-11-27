import { ImageRepository } from "./imageRepository.ts";
import { ForCreate, WithTimestamp } from "../entity/utils.ts";
import { Image, imageConverter } from "../entity/imageType.ts";
import {
  collection,
  doc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { FirestoreClientManager } from "./shared/firestoreClientManager.ts";
import { injectable } from "tsyringe";

@injectable()
export class ImageRepositoryImpl implements ImageRepository {
  private readonly colRef = (id: string) =>
    collection(db, `users/${id}/image`).withConverter(imageConverter);
  private readonly docRef = (id: string) =>
    doc(db, `users/${id}`).withConverter(imageConverter);

  private readonly clientManager = FirestoreClientManager.INSTANCE;

  async create({
    id,
    image,
  }: {
    id: string;
    image: ForCreate<Image>;
  }): Promise<Image> {
    try {
      const ref = doc(this.colRef(id));
      const data: WithTimestamp<Image> = {
        ...image,
        id: ref.id,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      await this.clientManager.getClient().set(ref, data);

      return this.convertTimestamps(data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async get({
    id,
  }: {
    id: string;
  }): Promise<Image | null> {
    try {
      const snapshot = await this.clientManager
        .getClient()
        .get(this.docRef(id));
      return snapshot.data() ?? null;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async delete({
    id,
  }: {
    id: string;
  }): Promise<Image> {
    try {
      const ref = this.docRef(id);
      await this.clientManager.getClient().update(ref, {
        updated_at: serverTimestamp(),
        deleted_at: serverTimestamp()
      });

      const snapshot = await this.clientManager.getClient().get(ref);
      const result = snapshot.data();

      if (result === undefined) {
        return Promise.reject(new Error("Document not found"));
      }

      return this.convertTimestamps(result);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  // async getPath({
  //   id
  // }: {
  //   id: string;
  // }): Promise<string> {
  //   try {
  //     const doc = await this.get({ id });
  //     if (!doc) {
  //       throw new Error("Document not found");
  //     }
  //     return doc.filename ?? "";
  //   } catch (e) {
  //     return Promise.reject(e);
  //   }
  // }

  private convertTimestamps(data: WithTimestamp<Image>): Image {
    return {
      ...data,
      created_at:
        data.created_at instanceof Timestamp
          ? data.created_at
          : Timestamp.now(),
      updated_at:
        data.updated_at instanceof Timestamp
          ? data.updated_at
          : Timestamp.now(),
      deleted_at: data.deleted_at instanceof Timestamp ? data.deleted_at : null,
    };
  }
}
