import {Document} from "../redux/document/documentType.ts";

export const DocumentItem = ({document, onClick}: {
    document: Document,
    onClick: (id: string) => void,
}) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <button onClick={() => onClick(document.id)}>
                <div className={'bg-white aspect-[3/4] p-4 rounded-md text-xs text-gray-600 ' +
                    'transition hover:bg-gray-50 text-left'}>
                    {document.contents}
                </div>
            </button>
            <div className={'flex flex-row justify-between items-center'}>
                <div>
                    <p className={'text-gray-700 text-base'}>
                        {document.title}
                    </p>
                    <p className={'text-gray-600 text-sm'}>
                        {document.updated_at.toDate().toLocaleDateString()}
                    </p>
                </div>
                <button className={'leading-3 p-2 rounded-full hover:bg-slate-200 transition-all'}>...</button>
            </div>
        </div>
    )
}

export const AddDocumentButton = ({onClick}: {
    onClick: () => void,
}) => {
    return (
        <button onClick={onClick} className={'rounded-full bg-slate-200 px-4 py-2 ' +
            'transition hover:bg-slate-300'}>
            新規ドキュメントを作成
        </button>
    )
}