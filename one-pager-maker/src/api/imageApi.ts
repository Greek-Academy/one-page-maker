import { useMutation, useQuery } from "@tanstack/react-query";
import { imageService } from "./services.ts";
import { queryClient } from "../queryClient.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Document } from "../entity/documentType.ts";

const queryKeys = {
  imageId: (id: string) =>
    `image-${id}`,
};

const invalidateQueries = async (id: string) => {
  await queryClient.invalidateQueries({
    queryKey: [queryKeys.imageId(id)]
  });
};

export const imageApi = {
  useGetImageQuery: (args: { id: string; }) =>
    useQuery({
      queryKey: [queryKeys.imageId(args.id)],
      queryFn: async () => {
        if (args.id === "") return;
        try {
          const result = await imageService.getImage(args);
          return result;
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }),

  useCreateImageMutation: () =>
    useMutation({
      mutationFn: async ({
        id,
      }: {
        id: string;
      }) => {
        if (id === "") return;
        const result = await imageService.createImage(id);
        return result;
      },
      onSuccess: async (image) => {
        if (image === undefined) return;
        await invalidateQueries(image.id);
      }
    }),

  useDeleteImageMutation: () =>
    useMutation({
      mutationFn: async (args: { id: string; }) => {
        if (args.id === "") return;
        const result = await imageService.deleteImage(args.id);
        return result;
      },
      onSuccess: async (image) => {
        if (image === undefined) return;
        await invalidateQueries(image.id);
      }
    }),

  useUpdateImageMutation: () =>
    useMutation({
      mutationFn: async ({
        uid,
        document
      }: {
        uid: string;
        document: ForUpdate<Document>;
      }) => {
        if (uid === "") return;
        const result = await imageService.updateImage(uid, document);
        return result;
      },
      onSuccess: async (image) => {
        if (image === undefined) return;
        await invalidateQueries(image.id);
      }
    }),

};
