import {useMutation, useQuery} from "@tanstack/react-query";
import {documentService} from "./services.ts";
import {queryClient} from "../queryClient.ts";
import {ForUpdate} from "../entity/utils.ts";
import {Document} from "../entity/documentType.ts";

const queryKeys = {
    documentId: (uid: string, documentId: string) => `document-${uid}-${documentId}`,
}

export const documentApi = {
    useGetDocumentQuery: (args: {uid: string, documentId: string}) => useQuery({
        queryKey: [queryKeys.documentId(args.uid, args.documentId)],
        queryFn: async () => {
            if (args.uid === "" || args.documentId === "") return;
            const result = await documentService.getDocument(args);
            return result;
        }
    }),
    useCreateDocumentMutation: () => useMutation({
        mutationFn: async ({uid}: {uid: string}) => {
            if (uid === "") return;
            const result = await documentService.createDocument(uid);
            return result;
        },
        onSuccess: async (document) => {
            if (document === undefined) return;
            await queryClient.invalidateQueries({queryKey: [queryKeys.documentId(document.owner_id, document.id)]});
        }
    }),
    useDeleteDocumentMutation: () => useMutation({
        mutationFn: async (args: {uid: string, documentId: string}) => {
            if (args.uid === "" || args.documentId === "") return;
            const result = await documentService.deleteDocument(args);
            return result;
        },
        onSuccess: async (document) => {
            if (document === undefined) return;
            await queryClient.invalidateQueries({queryKey: [queryKeys.documentId(document.owner_id, document.id)]});
        }
    }),
    useUpdateDocumentMutation: () => useMutation({
        mutationFn: async ({uid, document}: {uid: string, document: ForUpdate<Document>}) => {
            if (uid === "") return;
            const result = await documentService.updateDocument(uid, document);
            return result;
        },
        onSuccess: async (document) => {
            if (document === undefined) return;
            await queryClient.invalidateQueries({queryKey: [queryKeys.documentId(document.owner_id, document.id)]});
        }
    }),
}
