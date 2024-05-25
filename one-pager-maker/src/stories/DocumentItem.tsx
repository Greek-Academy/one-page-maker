import {Document} from "../entity/documentType.ts";
import {EllipsisIcon} from "lucide-react";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";

export const DocumentItem = ({document, onClick, onDelete}: {
    document: Document,
    onClick: (id: string) => void,
    onDelete: (id: string) => void,
}) => {
    return (
        <div className={'flex flex-col gap-3'}>
            <button onClick={() => onClick(document.id)}>
                <div className={'bg-card drop-shadow aspect-[3/4] p-4 rounded-md text-[0.6rem] text-gray-600 ' +
                    'transition hover:bg-gray-50 text-left whitespace-pre'}>
                    {document.contents}
                </div>
            </button>
            <div className={'flex flex-row justify-between items-center'}>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-gray-700 text-base'}>
                        {document.title}
                    </p>
                    <p className={'text-gray-600 text-xs'}>
                        {document.updated_at.toDate().toLocaleString()}
                    </p>
                </div>
                <div>
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className={'p-2'}>
                                <EllipsisIcon className="h-4 w-4" />
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem onClick={() => onDelete(document.id)}>
                                    ドキュメントを削除
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    )
}
