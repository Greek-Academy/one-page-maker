import { ForCreate } from "../entity/utils.ts";
import { Image } from "../entity/imageType.ts";
import { ImageRepositoryImpl } from "./imageRepositoryImpl.ts";

export const imageRepository: ImageRepository =
  new ImageRepositoryImpl();

export interface ImageRepository {
  create(args: {
    id: string;
    image: ForCreate<Image>;
  }): Promise<Image>;

  get(args: { id: string }): Promise<Image | null>;

  delete(args: { id: string }): Promise<Image>;
}
