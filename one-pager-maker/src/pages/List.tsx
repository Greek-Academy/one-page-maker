import {DocumentItem, SkeletonDocumentItem} from "../stories/DocumentItem.tsx";
import {useNavigate} from "react-router-dom";
import {auth} from '../firebase';
import {viewHistoryApi} from "../api/viewHistoryApi.ts";
import {ReactNode, useMemo} from "react";
import {documentApi} from "../api/documentApi.ts";
import ErrorContainer from "@/stories/ErrorContainer.tsx";
import {Document} from "@/entity/documentType.ts";
import {Button} from "@/components/ui/button.tsx";
import {toUndeletedDocuments} from "@/entity/viewHistory/viewHistoryUtils.ts";

export default function List() {
    const uid = auth.currentUser?.uid ?? "";
    const createDocument = documentApi.useCreateDocumentMutation();
    const deleteDocument = documentApi.useDeleteDocumentMutation();
    const navigate = useNavigate();

    const editHistories = viewHistoryApi.useGetEditHistoryQuery({uid: uid});
    const reviewHistories = viewHistoryApi.useGetReviewHistoryQuery({uid: uid});
    const editHistoryMutation = viewHistoryApi.useSetEditHistoryMutation();

    const editedDocuments = useMemo(() => {
        return toUndeletedDocuments(editHistories.data ?? []);
    }, [editHistories]);

    const reviewedDocuments = useMemo(() => {
        return toUndeletedDocuments(reviewHistories.data ?? []);
    }, [reviewHistories]);

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

    const handleDeleteDocument = async (id: string) => {
        // edited と reviewed から id に一致するドキュメントを探す
        const findDocumentById = (id: string) =>
            editedDocuments.find(d => d.id === id) ??
            reviewedDocuments.find(d => d.id === id);

        try {
            const document = findDocumentById(id);

            if (document === undefined) {
                return;
            }

            const deletedDoc = await deleteDocument.mutateAsync({uid, documentId: id});
            await editHistoryMutation.mutateAsync({uid, documentId: id, document: deletedDoc});
        } catch (e) {
            alert(`エラー: ${e?.toString()}`)

        }
    }

    return (
        <main className={"bg-background h-min-screen " +
            "max-w-screen-lg mx-auto px-4 py-8 flex flex-col gap-6"}>
            <div>
                <Button onClick={handleCreate}>
                    新規ドキュメントを作成
                </Button>
            </div>
            <DocumentListSection heading={"最近更新したドキュメント"}
                                 documents={editedDocuments}
                                 status={editHistories.status}
                                 error={editHistories.error}
                                 onDeleteDocument={handleDeleteDocument}
                                 onClickDocument={handleClickDocument}/>
            <DocumentListSection heading={"最近レビューしたドキュメント"}
                                 documents={reviewedDocuments}
                                 status={reviewHistories.status}
                                 error={reviewHistories.error}
                                 onDeleteDocument={handleDeleteDocument}
                                 onClickDocument={handleClickDocument}/>
        </main>
    )
}

function DocumentListSection({heading, documents, status, error, onDeleteDocument, onClickDocument}: {
    heading: string
    documents: Document[],
    status: 'success' | 'error' | 'pending',
    error: Error | null,
    onDeleteDocument: (id: string) => void,
    onClickDocument: (id: string) => void
}) {
    return (
        <section>
            <h2 className={"text-lg py-4"}>{heading}</h2>
            {status === 'error' && (
                <ErrorContainer>{error?.message}</ErrorContainer>
            )}
            {status === 'pending' && (
                <Grid>
                    {[0, 0, 0].map((_) => (
                        <SkeletonDocumentItem key={_}/>
                    ))}
                </Grid>
            )}
            {status === 'success' && documents.length > 0 && (
                <Grid>
                    {documents?.map(d => (
                        <DocumentItem key={d.id} document={d}
                                      onDelete={onDeleteDocument}
                                      onClick={onClickDocument}/>
                    ))}
                </Grid>
            )}
            {status === 'success' && documents.length === 0 && (
                <div className={"text-secondary-foreground text-base"}>
                    ドキュメントがありません
                </div>
            )}
        </section>
    )
}

function Grid({children}: {
    children: ReactNode
}) {
    return (
        <div className={'grid gap-x-4 gap-y-6 flex-wrap'} style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
        }}>
            {children}
        </div>
    )
}
