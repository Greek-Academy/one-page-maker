import { Image } from "../entity/imageType.ts";
import { Result } from "result-type-ts";

export interface ImageService {
  getImage(id: string): Promise<Result<Image | undefined, ImageServiceError>>;

  createImage(id: string): Promise<Image>;

  deleteImage(id: string): Promise<Image>;
}

type ImageServiceErrorCode = "permission-denied" | "unknown";

export class ImageServiceError extends Error {
  constructor(
    message: string,
    public readonly code: ImageServiceErrorCode
  ) {
    super(message);
    this.name = "ImageServiceError";
  }
}
