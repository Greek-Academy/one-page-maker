import {useCreateDocumentMutation, useFetchDocumentsQuery} from "./redux/document/documentsApi.ts";

export default function TestRedux() {
    const [createDocument, result] = useCreateDocumentMutation();
    const { data } = useFetchDocumentsQuery({uid: 'testUid'});

    return (
        <div className={'p-4'}>
            {JSON.stringify(result, undefined, '  ')}
            <button onClick={() => {
                createDocument({
                    uid: 'testUid',
                    documentData: {
                        title: "Test Title",
                        contents: "hello",
                        status: 'draft',
                        owner_id: 'testUid',
                        contributors: [],
                        reviewers: [],
                        url_privilege: 'private',
                    }
                })
            }}>createDocument
            </button>
            {JSON.stringify(data)}
        </div>
    )
}
