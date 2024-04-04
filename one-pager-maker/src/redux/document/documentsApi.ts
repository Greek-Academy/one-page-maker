import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {collection, doc, getDocs, serverTimestamp, setDoc, updateDoc, Timestamp} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {Document, documentConverter, DocumentForCreate, DocumentForDelete, DocumentForUpdate} from "./documentType.ts";
import {WithTimestamp} from "../../utils/typeUtils.ts";

// TODO: providesTags or invalidatesTag を追加する必要があるかもしれない
export const documentsApi = createApi({
    reducerPath: "documents",
    baseQuery: fakeBaseQuery(),
    tagTypes: ['Documents'],
    endpoints: (builder) => ({
        fetchDocuments: builder.query({
            async queryFn(args: { uid: string }) {
                try {
                    const colRef = collection(db, `users/${args.uid}/documents`)
                        .withConverter(documentConverter);
                    const snapshot = await getDocs(colRef);
                    return {data: snapshot.docs.map(doc => doc.data())};
                } catch (error) {
                    return {error}
                }
            },
        }),
        createDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForCreate }) {
                try {
                    const docRef = doc(db, `users/${args.uid}/documents`)
                        .withConverter(documentConverter);
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
                    return {error}
                }
            },
        }),
        updateDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForUpdate }) {
                try {
                    const docRef = doc(db, `users/${args.uid}/documents/${args.documentData.id}`)
                        .withConverter(documentConverter);
                    const data: WithTimestamp<Document> = {
                        ...args.documentData,
                        updated_at: serverTimestamp(),
                    }
                    await updateDoc(docRef, data);
                    const resultData: Document = {
                        ...args.documentData,
                        updated_at: Timestamp.now(),
                    }
                    return {data: resultData};
                } catch (error) {
                    return {error};
                }
            }
        }),
        deleteDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForDelete }) {
                try {
                    const docRef = doc(db, `users/${args.uid}/documents/${args.documentData.id}`)
                        .withConverter(documentConverter);
                    const data: WithTimestamp<Document> = {
                        ...args.documentData,
                        deleted_at: serverTimestamp(),
                    }
                    await updateDoc(docRef, data);
                    const resultData: Document = {
                        ...args.documentData,
                        deleted_at: Timestamp.now(),
                    }
                    return {data: resultData};
                } catch (error) {
                    return {error};
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
    useCreateDocumentMutation,
    useUpdateDocumentMutation,
    useDeleteDocumentMutation
} = documentsApi
