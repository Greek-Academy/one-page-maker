import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {documentConverter} from "./documentType.ts";

export const documentsApi = createApi({
    reducerPath: "documents",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({

        fetchDocuments: builder.query({
            async queryFn(uid: string) {
                try {
                    const colRef = collection(db, `users/${uid}/documents`)
                        .withConverter(documentConverter);
                    const snapshot = await getDocs(colRef);
                    return {data: snapshot.docs.map(doc => doc.data())};
                } catch (e) {
                    return {error: e}
                }
            }
        })
    })
})
export const { useFetchDocumentsQuery } = documentsApi
