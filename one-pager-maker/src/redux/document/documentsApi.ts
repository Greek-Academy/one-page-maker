import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {collection, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {Document, documentConverter, DocumentForCreate, DocumentForUpdate} from "./documentType.ts";
import {WithTimestamp} from "../../utils/typeUtils.ts";

const colRef = (uid: string) => collection(db, `users/${uid}/documents`)
    .withConverter(documentConverter);
const docRef = (uid: string, docId: string) => doc(db, `users/${uid}/documents/${docId}`)
    .withConverter(documentConverter)

// TODO: providesTags or invalidatesTag を追加する必要があるかもしれない
export const documentsApi = createApi({
    reducerPath: "documents",
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Documents'],
    endpoints: (builder) => ({
        fetchDocuments: builder.query({
            async queryFn(args: { uid: string }) {
                try {
                    const snapshot = await getDocs(colRef(args.uid));
                    return {data: snapshot.docs.map(doc => doc.data())};
                } catch (error) {
                    return {error}
                }
            },
            providesTags: (results) => {
                if (results === undefined) {
                    return [];
                } else {
                    return results.map(result => ({type: 'Documents', id: result.id}))
                }
            }
        }),
        fetchDocument: builder.query({
            async queryFn(args: { uid: string, docId: string }) {
                try {
                    const snapshot = await getDoc(docRef(args.uid, args.docId));
                    return {data: snapshot.data()};
                } catch (error) {
                    return {error}
                }
            },
            providesTags: (result) => {
                if (result === undefined) {
                    return [];
                } else {
                    return [{type: 'Documents', id: result.id}]
                }
            }
        }),
        createDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForCreate }) {
                try {
                    const docRef = doc(colRef(args.uid));
                    const data: WithTimestamp<Document> = {
                        ...args.documentData,
                        id: docRef.id,
                        created_at: serverTimestamp(),
                        updated_at: serverTimestamp(),
                        deleted_at: null
                    }
                    await setDoc(docRef, data);
                    const resultData: Document = {
                        ...data,
                        created_at: Timestamp.now(),
                        updated_at: Timestamp.now(),
                        deleted_at: null,
                    }

                    return {data: resultData}
                } catch (error) {
                    console.error(error);
                    return {error}
                }
            },
            async onQueryStarted({uid}, { dispatch, queryFulfilled, getCacheEntry }) {
                try {
                    await queryFulfilled
                    dispatch(
                        documentsApi.util.updateQueryData('fetchDocuments', {uid}, (draft) => {
                            if (draft === undefined) return;
                            const updatedDoc = getCacheEntry().data;

                            if (updatedDoc === undefined) {
                                return;
                            }

                            draft.unshift(updatedDoc);
                        })
                    )
                } catch {
                    // patchResult.undo()
                }
            },
        }),
        updateDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForUpdate }) {
                try {
                    await updateDoc(docRef(args.uid, args.documentData.id), {
                        ...args.documentData,
                        updated_at: serverTimestamp(),
                    });
                    const data = {
                        updated_at: Timestamp.now(),
                    }
                    return {data};
                } catch (error) {
                    return {error};
                }
            },
            async onQueryStarted({uid, documentData}, { dispatch, queryFulfilled, getCacheEntry }) {
                const patchResult = dispatch(
                    documentsApi.util.updateQueryData('fetchDocuments', {uid}, (draft) => {
                        if (draft === undefined) return;
                        const docIndex = draft.findIndex(d => d.id === documentData.id);
                        const updatedDoc = getCacheEntry();
                        draft[docIndex] = {...draft[docIndex], ...updatedDoc.data}
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
        }),
        deleteDocument: builder.mutation({
            async queryFn(args: { uid: string, documentId: string }) {
                try {
                    await updateDoc(docRef(args.uid, args.documentId), {
                        deleted_at: serverTimestamp(),
                    });
                    const data = {
                        deleted_at: Timestamp.now(),
                    }
                    return {data};
                } catch (error) {
                    return {error};
                }
            },
            async onQueryStarted({uid, documentId}, { dispatch, queryFulfilled, getCacheEntry }) {

                try {
                    await queryFulfilled
                    dispatch(
                        documentsApi.util.updateQueryData('fetchDocuments', {uid}, (draft) => {
                            if (draft === undefined) return;
                            const docIndex = draft.findIndex(d => d.id === documentId);
                            const updatedDoc = getCacheEntry();
                            draft[docIndex] = {...draft[docIndex], ...updatedDoc.data}
                        })
                    )
                } catch {
                    // patchResult.undo()
                }
            },
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
