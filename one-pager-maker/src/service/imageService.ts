import { Image } from "../entity/imageType.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Result } from "result-type-ts";

export interface ImageService {
  getImage(args: {
    id: string;
  }): Promise<Result<Image | undefined, ImageServiceErrorCode>>;

  createImage(id: string): Promise<Image>;

  updateImage(id: string, image: ForUpdate<Image>): Promise<Image>;

  deleteImage(args: { id: string }): Promise<Image>;

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
