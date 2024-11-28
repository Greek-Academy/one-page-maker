import { ImageService, ImageServiceError } from "./imageService.ts";
import { ImageRepository } from "../repository/imageRepository.ts";
import { Image } from "../entity/imageType.ts";
import { inject, injectable } from "tsyringe";
import { DI } from "../di.ts";
import { Result } from "result-type-ts";
import { FirestoreError } from "@firebase/firestore";
import { ForCreate } from "../entity/utils.ts";

@injectable()
export class ImageServiceImpl implements ImageService {
  constructor(
    @inject(DI.ImageRepository)
    private imageRepository: ImageRepository
  ) { }

  async getImage(id: string): Promise<Result<Image | undefined, ImageServiceError>> {
    try {
      const result = await this.imageRepository.get({ id });
      return Result.success(result ?? undefined);
    } catch (e) {
      return this.handleFirestoreErrorSingle(e);
    }
  }

  async createImage(id: string): Promise<Image> {
    const newImage = this.createNewImageObject(id);
    try {
      const image = await this.imageRepository.create({
        id,
        image: newImage
      });
      return image;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  //  deleteImage(id: string): Prfomise<Image>;

  async deleteImage(id: string): Promise<Image> {
    try {
      return await this.imageRepository.delete({ id });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private createNewImageObject(
    id: string,
  ): ForCreate<Image> {
    return {
      owner_id: id,
      document_id: id,
      image_url: '',
      deleted_at: null
    };
  }

  private handleFirestoreErrorSingle(
    e: unknown
  ): Result<undefined, ImageServiceError> {
    if (e instanceof FirestoreError) {
      switch (e.code) {
        case "permission-denied":
          return Result.failure(
            new ImageServiceError(e.message, "permission-denied")
          );
        case "not-found":
          return Result.success(undefined);
        default:
          return Result.failure(new ImageServiceError(e.message, "unknown"));
      }
    }
    return Result.failure(new ImageServiceError("Unknown error", "unknown"));
  }

}
