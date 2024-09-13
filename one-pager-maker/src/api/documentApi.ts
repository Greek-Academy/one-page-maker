import { useMutation, useQuery } from "@tanstack/react-query";
import { documentService } from "./services.ts";
import { queryClient } from "../queryClient.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Document } from "../entity/documentType.ts";

const queryKeys = {
  documentPath: (uid: string, filepath: string) => `document-${uid}-${filepath}`
};

export const documentApi = {
  useGetDocumentQuery: (args: { uid: string; filepath: string }) =>
    useQuery({
      queryKey: [queryKeys.documentPath(args.uid, args.filepath)],
      queryFn: async () => {
        if (args.uid === "" || args.filepath === "") return;
        try {
          const result = await documentService.getDocument(args);
          return result;
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }),
  useCreateDocumentMutation: () =>
    useMutation({
      mutationFn: async ({
        uid,
        filepath,
        filename
      }: {
        uid: string;
        filepath: string;
        filename: string;
      }) => {
        if (uid === "" || filepath === "" || filename === "") return;
        const result = await documentService.createDocument({
          uid,
          filepath,
          filename
        });
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await queryClient.invalidateQueries({
          queryKey: [
            queryKeys.documentPath(document.owner_id, document.filepath)
          ]
        });
      }
    }),
  useDeleteDocumentMutation: () =>
    useMutation({
      mutationFn: async (args: { uid: string; filepath: string }) => {
        if (args.uid === "" || args.filepath === "") return;
        const result = await documentService.deleteDocument(args);
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await queryClient.invalidateQueries({
          queryKey: [
            queryKeys.documentPath(document.owner_id, document.filepath)
          ]
        });
      }
    }),
  useUpdateDocumentMutation: () =>
    useMutation({
      mutationFn: async ({
        uid,
        document
      }: {
        uid: string;
        document: ForUpdate<Document>;
      }) => {
        if (uid === "") return;
        const result = await documentService.updateDocument(uid, document);
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await queryClient.invalidateQueries({
          queryKey: [
            queryKeys.documentPath(document.owner_id, document.filepath)
          ]
        });
      }
    }),
  useGetDocumentsByPathQuery: (args: { uid: string; filepath: string }) =>
    useQuery({
      queryKey: [queryKeys.documentPath(args.uid, args.filepath), "list"],
      queryFn: async () => {
        if (args.uid === "" || args.filepath === "") return;
        try {
          const result = await documentService.getDocumentsByPath(args);
          return result;
        } catch (e) {
          return Promise.reject(e);
        }
      }
    })
};
