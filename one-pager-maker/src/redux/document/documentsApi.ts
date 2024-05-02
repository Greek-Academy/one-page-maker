import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {Document} from "../../entity/documentType.ts";
import {documentService} from "../../service/documentService.ts";

const DOCUMENT_TAG = 'Document';

// TODO: providesTags or invalidatesTag を追加する必要があるかもしれない
export const documentsApi = createApi({
    reducerPath: "documents",
    baseQuery: fakeBaseQuery(),
    tagTypes: [DOCUMENT_TAG],
    endpoints: (builder) => ({
        fetchDocuments: builder.query({
            async queryFn(args: { uid: string }) {
                try {
                    const data = await documentService.getMany(args.uid);
                    return {data};
                } catch (error) {
                    return {error}
                }
            },
            providesTags: (result) => {
                if (result === undefined) {
                    return [];
                } else {
                    return result.map(result => ({
                        type: DOCUMENT_TAG,
                        id: result.id
                    }))
                }
            }
        }),
        fetchDocument: builder.query({
            async queryFn(args: { uid: string, docId: string }) {
                try {
                    const data = await documentService.get(args.uid, args.docId);
                    return {data};
                } catch (error) {
                    return {error}
                }
            },
            providesTags: (result) => {
                if (result === undefined) {
                    return [];
                } else {
                    return [{type: DOCUMENT_TAG, id: result.id}]
                }
            }
        }),
        createDocument: builder.mutation({
            async queryFn(args: { uid: string }) {
                try {
                    const data = await documentService.create(args.uid);
                    return {data}
                } catch (error) {
                    return {error}
                }
            },
            invalidatesTags(result) {
                if (result === undefined) {
                    return [];
                } else {
                    return [{type: DOCUMENT_TAG, id: result.id}];
                }
            }
        }),
        updateDocument: builder.mutation({
            async queryFn({uid, documentData}: {
                uid: string,
                documentData: Document
            }) {
                try {
                    const data = await documentService.update(uid, documentData);
                    return {data};
                } catch (error) {
                    return {error};
                }
            },
            invalidatesTags(result) {
                if (result === undefined) {
                    return [];
                } else {
                    return [{type: DOCUMENT_TAG, id: result.id}];
                }
            }
        }),
        deleteDocument: builder.mutation({
            async queryFn(args: { document: Document }) {
                try {
                    const data = await documentService.delete(args.document.owner_id, args.document);
                    return {data};
                } catch (error) {
                    return {error};
                }
            },
            invalidatesTags(result) {
                if (result === undefined) {
                    return [];
                } else {
                    return [{type: DOCUMENT_TAG, id: result.id}];
                }
            }
        })
    })
})

/**
 * Component 内ではこれを使う
 * https://redux-toolkit.js.org/rtk-query/overview#use-hooks-in-components
 */
export const {
    useFetchDocumentsQuery,
    useFetchDocumentQuery,
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation
} = documentsApi
