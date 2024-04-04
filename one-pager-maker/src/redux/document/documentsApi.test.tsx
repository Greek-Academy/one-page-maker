import {ReactNode} from "react";
import {store} from "../store.ts";
import {Provider} from "react-redux";
import {beforeAll, beforeEach, describe, expect, test} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {useCreateDocumentMutation, useFetchDocumentsQuery} from "./documentsApi.ts";
import {collection, connectFirestoreEmulator, doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase.ts";
import {DocumentForCreate} from "./documentType.ts";

function Wrapper(props: { children: ReactNode }) {
    return <Provider store={store}>{props.children}</Provider>;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

    beforeAll(async () => {
        // エミュレータに接続
        connectFirestoreEmulator(db, 'localhost', 4001);
        // 事前に一度呼び出さないと，test() で失敗する. 理由は分からない.
        await setDoc(doc(collection(db, `test`)), {
            test: "test"
        });
    })

    beforeEach(() => {
        // テストごとにDBのデータを削除
        fetch('http://localhost:4001/emulator/v1/projects/one-pager-maker/databases/(default)/documents', {method: 'DELETE'})
    })

    test("createDocument should create data correctly", async () => {
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

        // 1秒間更新を待つ. TODO: 一定時間待つ以外に方法はないか？
        await act(async () => {
            await delay(400);
        })

        expect(result.current[1].isSuccess).toBe(true);
    })

    test("Firestore emulators' data should be deleted before each test", async () => {
        const fetchDocHook = renderHook(() => useFetchDocumentsQuery({uid: testUserId}), {
            wrapper: Wrapper
        });

        await act(async () => {
            await delay(400);
        })

        expect(fetchDocHook.result.current.data?.length).toBe(0)
    })

    // test("createDocument should add data to cache", async () => {
    //     // 先に fetch
    //     const fetchDocHook = renderHook(() => useFetchDocumentsQuery({uid: testUserId}), {
    //         wrapper: Wrapper
    //     });
    //
    //     const createDocHook = renderHook(() => useCreateDocumentMutation(), {
    //         wrapper: Wrapper
    //     });
    //
    //     act(() => {
    //         const [createDocument] = createDocHook.result.current;
    //         createDocument({
    //             uid: testUserId,
    //             documentData: testDocument
    //         });
    //         createDocument({
    //             uid: testUserId,
    //             documentData: testDocument
    //         });
    //         createDocument({
    //             uid: testUserId,
    //             documentData: testDocument
    //         });
    //     });
    //
    //     await act(async () => {
    //         await delay(500);
    //     })
    //
    //     expect(fetchDocHook.result.current.data?.length).toBe(3)
    // })
})
