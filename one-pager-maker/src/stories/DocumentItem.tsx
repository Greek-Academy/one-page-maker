import {Document} from "../redux/document/documentType.ts";
import {useState} from "react";
import {Menu, MenuItem} from "./Menu.tsx";
import {useDetectClickOutside} from "react-detect-click-outside";

export const DocumentItem = ({document, onClick, onDelete}: {
    document: Document,
    onClick: (id: string) => void,
    onDelete: (id: string) => void,
}) => {
    const [openMenu, setOpenMenu] = useState(false);

    const ref = useDetectClickOutside({
        onTriggered: () => setOpenMenu(false)
    })

    return (
        <div className={'flex flex-col gap-2'}>
            <button onClick={() => onClick(document.id)}>
                <div className={'bg-white aspect-[3/4] p-4 rounded-md text-xs text-gray-600 ' +
                    'transition hover:bg-gray-50 text-left'} style={{

                    boxSizing: "border-box",
                    resize: "horizontal",
                    overflow: "auto",
                    msOverflowStyle: "none",
                    /* Firefox 対応 */
                    scrollbarWidth: "none"
                }}>
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
                <div ref={ref}>
                    <button
                        onClick={() => setOpenMenu(true)}
                        className={'leading-3 p-2 rounded-full hover:bg-slate-200 transition-all'}>
                        ...
                    </button>
                    <Menu open={openMenu}>
                        <MenuItem>
                            <button onClick={() => onDelete(document.id)}>
                                ドキュメントを削除する
                            </button>
                        </MenuItem>
                    </Menu>
                </div>
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