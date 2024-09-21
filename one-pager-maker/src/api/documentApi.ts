import { useMutation, useQuery } from "@tanstack/react-query";
import { documentService } from "./services.ts";
import { queryClient } from "../queryClient.ts";
import { ForUpdate } from "../entity/utils.ts";
import { Document } from "../entity/documentType.ts";

const queryKeys = {
  documentId: (uid: string, documentId: string) =>
    `document-${uid}-${documentId}`,
  documentsUnderParent: (uid: string, parentId?: string) =>
    `documents-${uid}-${parentId || "root"}`
};

const invalidateQueries = async (document: Document) => {
  await queryClient.invalidateQueries({
    queryKey: [queryKeys.documentId(document.owner_id, document.id)]
  });
  await queryClient.invalidateQueries({
    queryKey: [
      queryKeys.documentsUnderParent(
        document.owner_id,
        document.path.split("/").slice(-2, -1)[0] || undefined
      )
    ]
  });
};

export const documentApi = {
  useGetDocumentQuery: (args: { uid: string; documentId: string }) =>
    useQuery({
      queryKey: [queryKeys.documentId(args.uid, args.documentId)],
      queryFn: async () => {
        if (args.uid === "" || args.documentId === "") return;
        try {
          const result = await documentService.getDocument(args);
          return result;
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }),

  useGetDocumentsUnderParentQuery: (args: { uid: string; parentId?: string }) =>
    useQuery({
      queryKey: [queryKeys.documentsUnderParent(args.uid, args.parentId)],
      queryFn: async () => {
        if (args.uid === "") return;
        try {
          const result = await documentService.getDocumentsUnderParent(args);
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
        parentId
      }: {
        uid: string;
        parentId?: string;
      }) => {
        if (uid === "") return;
        const result = await documentService.createDocument(uid, parentId);
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await invalidateQueries(document);
      }
    }),

  useDeleteDocumentMutation: () =>
    useMutation({
      mutationFn: async (args: { uid: string; documentId: string }) => {
        if (args.uid === "" || args.documentId === "") return;
        const result = await documentService.deleteDocument(args);
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await invalidateQueries(document);
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
        await invalidateQueries(document);
      }
    }),

  useMoveDocumentMutation: () =>
    useMutation({
      mutationFn: async ({
        uid,
        documentId,
        newParentId
      }: {
        uid: string;
        documentId: string;
        newParentId: string | null;
      }) => {
        if (uid === "" || documentId === "") return;
        const result = await documentService.moveDocument({
          uid,
          documentId,
          newParentId: newParentId || null
        });
        return result;
      },
      onSuccess: async (document) => {
        if (document === undefined) return;
        await invalidateQueries(document);
      }
    })
};
