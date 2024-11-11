import { ForCreate, ForUpdate } from "../entity/utils.ts";
import { Image } from "../entity/imageType.ts";
import { ImageRepositoryImpl } from "./imageRepositoryImpl.ts";

export const imageRepository: ImageRepository =
  new ImageRepositoryImpl();

export interface ImageRepository {
  create(args: {
    id: string;
    document: ForCreate<Image>;
  }): Promise<Image>;

  get(args: { id: string }): Promise<Image | null>;

  update(args: {
    id: string;
    document: ForUpdate<Image>;
  }): Promise<Image>;

  move(args: {
    id: string;
  }): Promise<Image>;

  delete(args: { id: string }): Promise<Image>;
}
