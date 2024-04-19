import './List.css'
import {useCreateDocumentMutation, useFetchDocumentsQuery} from "../redux/document/documentsApi.ts";
import {DocumentItem} from "../stories/DocumentItem.tsx";
import {useNavigate} from "react-router-dom";

function List() {
    const uid = 'testUser'
    const {data, error, isError, isLoading} = useFetchDocumentsQuery({uid: uid});
    const [createDocument] = useCreateDocumentMutation();
    const navigate = useNavigate();

    const handleCreate = () => {
        createDocument({
            uid: uid,
            documentData: {
                title: "Title",
                contents: "#Title\nabcde",
                status: 'draft',
                owner_id: uid,
                contributors: [],
                reviewers: [],
                url_privilege: 'private',
            }
        })
    }

    const handleClickDocument = (id: string) => {
        navigate(`/edit/${id}`);
    }

    return (
        <main className={"bg-slate-100 h-screen"}>
            <button onClick={handleCreate}>new</button>
            <div className={"max-w-screen-lg mx-auto"}>
                {!isError && (
                    isLoading ?
                        <p>Loading...</p>
                        :
                        <div className={'grid grid-cols-5 gap-x-4 gap-y-6'}>
                            {data?.map(d =>
                                <DocumentItem key={d.id} document={d} onClick={handleClickDocument}/>
                            )}
                        </div>
                )}
                {isError && (
                    <p>{error?.toString()}</p>
                )}
            </div>
        </main>
    )
}

export default List
