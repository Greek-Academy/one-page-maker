import './List.css'
import {
    useCreateDocumentMutation,
    useDeleteDocumentMutation,
    useFetchDocumentsQuery
} from "../redux/document/documentsApi.ts";
import {AddDocumentButton, DocumentItem} from "../stories/DocumentItem.tsx";
import {useNavigate} from "react-router-dom";
import {auth} from '../firebase';

const getStatus = (isError: boolean, isLoading: boolean) => {
    if (isError) return 'error'
    if (isLoading) return 'loading'
    return 'completed'
}

function List() {
    const uid = auth.currentUser?.uid ?? "";
    const {
        data,
        error,
        isError,
        isLoading
    } = useFetchDocumentsQuery({uid: uid});
    const [createDocument] = useCreateDocumentMutation();
    const [deleteDocument] = useDeleteDocumentMutation();
    const navigate = useNavigate();
    const status = getStatus(isError, isLoading);

    const handleCreate = async () => {
        try {
            const result = await createDocument({uid: uid,});
            if ('data' in result) {
                navigate(`/edit/${result.data?.id}`);
            }
        } catch (e) {
            alert(`エラー: ${e?.toString()}`)
        }
    }

    const handleClickDocument = (id: string) => {
        navigate(`/edit/${id}`);
    }

    const handleDelete = async (id: string) => {
        if (data === undefined) {
            return;
        }
        try {
            const document = data.find(d => d.id === id)

            if (document === undefined) {
                return;
            }

            await deleteDocument({document});
        } catch (e) {
            alert(`エラー: ${e?.toString()}`)

        }
    }

    return (
        <main className={"bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg mx-auto py-8 flex flex-col gap-6"}>
                <div>
                    <AddDocumentButton onClick={() => handleCreate()}/>
                </div>
                {status == 'loading' && <p>Loading...</p>}
                {status == 'error' && <p>{error?.toString()}</p>}
                {status == 'completed' &&
                    <div className={'grid grid-cols-5 gap-x-4 gap-y-6'}>
                        {data?.filter(d => d.deleted_at == null).map(d =>
                            <DocumentItem key={d.id} document={d}
                                          onDelete={handleDelete}
                                          onClick={handleClickDocument}/>
                        )}
                    </div>
                }
            </div>
        </main>
    )
}

export default List
