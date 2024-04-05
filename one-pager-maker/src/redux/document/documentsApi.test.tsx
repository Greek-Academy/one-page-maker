import {ReactNode} from "react";
import {store} from "../store.ts";
import {Provider} from "react-redux";
import {beforeAll, beforeEach, describe, expect, test} from "vitest";
import {act, renderHook, waitFor} from "@testing-library/react";
import {useCreateDocumentMutation, useFetchDocumentsQuery} from "./documentsApi.ts";
import {connectFirestoreEmulator} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {DocumentForCreate} from "./documentType.ts";

function Wrapper(props: { children: ReactNode }) {
    return <Provider store={store}>{props.children}</Provider>;
}

describe("documentsApi Unit Test", () => {
    const testUserId = 'testUid';
    const testDocument: DocumentForCreate = {
        title: "Test Title",
        contents: "hello",
        status: 'draft',
        owner_id: testUserId,
        contributors: [],
        reviewers: [],
        url_privilege: 'private',
    }
    const host = '127.0.0.1';
    const port = 4001;

    beforeAll(async () => {
        // エミュレータに接続
        connectFirestoreEmulator(db, host, port);
    })

    beforeEach(async () => {
        try {
            // テストごとにDBのデータを削除
            await fetch(`http://${host}:${port}/emulator/v1/projects/one-pager-maker/databases/(default)/documents`, {method: 'DELETE'})
        } catch (e) {
            console.error(e);
        }
    })

    test("createDocument works correctly", async () => {
        const {result} = renderHook(() => useCreateDocumentMutation(), {
            wrapper: Wrapper
        });

        act(() => {
            const [createDocument] = result.current;
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
        })

        waitFor(() => {
            expect(result.current[1].isSuccess).toBe(true);
        })

    })

    test("Firestore emulators' data should be deleted before each test", async () => {
        const fetchDocHook = renderHook(() => useFetchDocumentsQuery({uid: testUserId}), {
            wrapper: Wrapper
        });

        waitFor(() => {
            expect(fetchDocHook.result.current.data?.length).toBe(0)
        })
    })

    test("createDocument should add data to cache", async () => {
        // 先に fetch
        const fetchDocHook = renderHook(() => useFetchDocumentsQuery({uid: testUserId}), {
            wrapper: Wrapper
        });

        const createDocHook = renderHook(() => useCreateDocumentMutation(), {
            wrapper: Wrapper
        });

        act(() => {
            const [createDocument] = createDocHook.result.current;
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
        });

        waitFor(() => {
            expect(fetchDocHook.result.current.data?.length).toBe(3)
        })
    })

    test("fetchDocuments shouldn't cache duplicated data", () => {
        const createDocHook = renderHook(() => useCreateDocumentMutation(), {
            wrapper: Wrapper
        });

        act(() => {
            const [createDocument] = createDocHook.result.current;
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
            createDocument({
                uid: testUserId,
                documentData: testDocument
            });
        });

        // 後から fetch
        const fetchDocHook = renderHook(() => useFetchDocumentsQuery({uid: testUserId}), {
            wrapper: Wrapper
        });

        waitFor(() => {
            expect(fetchDocHook.result.current.data?.length).toBe(3)
        })
    })
})
