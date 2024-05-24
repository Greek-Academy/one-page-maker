import {AddDocumentButton, DocumentItem} from "../stories/DocumentItem.tsx";
import {useNavigate} from "react-router-dom";
import {auth} from '../firebase';
import {viewHistoryApi} from "../api/viewHistoryApi.ts";
import {ReactNode, useMemo} from "react";
import {documentApi} from "../api/documentApi.ts";

export default function List() {
    const uid = auth.currentUser?.uid ?? "";
    const createDocument = documentApi.useCreateDocumentMutation();
    const deleteDocument = documentApi.useDeleteDocumentMutation();
    const navigate = useNavigate();

    const reviewHistories = viewHistoryApi.useGetReviewHistoryQuery({uid: uid});
    const editHistories = viewHistoryApi.useGetEditHistoryQuery({uid: uid});

    const documents = useMemo(() => {
        return editHistories.data?.map(his => his.document);
    }, [editHistories]);

    const handleCreate = async () => {
        try {
            const result = await createDocument.mutateAsync({uid: uid});
            if (result !== undefined) {
                navigate(`/edit/${result.id}`);
            }
        } catch (e) {
            alert(`エラー: ${e?.toString()}`)
        }
    }

    const handleClickDocument = (id: string) => {
        navigate(`/edit/${id}`);
    }

    const handleDelete = async (id: string) => {
        if (documents === undefined) {
            return;
        }
        try {
            const document = documents.find(d => d.id === id)

            if (document === undefined) {
                return;
            }

            await deleteDocument.mutateAsync({uid, documentId: id});
        } catch (e) {
            alert(`エラー: ${e?.toString()}`)

        }
    }

    return (
        <main className={"bg-slate-100 h-screen"}>
            <div className={"max-w-screen-lg mx-auto px-4 py-8 flex flex-col gap-6"}>
                <div>
                    <AddDocumentButton onClick={() => handleCreate()}/>
                </div>
                <div>
                    <h2 className={"text-lg py-4"}>最近使用したドキュメント</h2>
                    {editHistories.status === 'error' && (
                        <p>{editHistories.error?.message}</p>
                    )}
                    {editHistories.status === 'success' && (
                        <div className={'grid gap-x-4 gap-y-6 flex-wrap'} style={{
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
                        }}>
                            {documents?.map(d => (
                                <DocumentItem key={d.id} document={d}
                                              onDelete={handleDelete}
                                              onClick={handleClickDocument}/>
                            ))}
                        </div>
                    )}
                    <h2 className={"text-lg py-4"}>最近使用したドキュメント</h2>
                </div>
            </div>
        </main>
    )
}

function Heading({children}: {
    children: ReactNode
}) {
    ret
}
