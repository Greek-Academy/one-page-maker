import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {collection, doc, getDocs, serverTimestamp, setDoc, updateDoc, Timestamp} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {Document, documentConverter, DocumentForCreate, DocumentForDelete, DocumentForUpdate} from "./documentType.ts";
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
        }),
        updateDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForUpdate }) {
                try {
                    await updateDoc(docRef(args.uid, args.documentData.id), {
                        ...args.documentData,
                        updated_at: serverTimestamp(),
                    });
                    const data: Document = {
                        ...args.documentData,
                        updated_at: Timestamp.now(),
                    }
                    return {data};
                } catch (error) {
                    return {error};
                }
            }
        }),
        deleteDocument: builder.mutation({
            async queryFn(args: { uid: string, documentData: DocumentForDelete }) {
                try {
                    await updateDoc(docRef(args.uid, args.documentData.id), {
                        ...args.documentData,
                        deleted_at: serverTimestamp(),
                    });
                    const data: Document = {
                        ...args.documentData,
                        deleted_at: Timestamp.now(),
                    }
                    return {data};
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
