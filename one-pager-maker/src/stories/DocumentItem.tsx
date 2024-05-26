import {Document} from "../entity/documentType.ts";
import {EllipsisIcon, Trash2Icon} from "lucide-react";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Link} from "react-router-dom";

export const DocumentItem = ({document, onDelete}: {
    document: Document,
    onDelete: (id: string) => void,
}) => {
    return (
        <div className={'flex flex-col gap-3'}>
            <Link to={`/edit/${document.owner_id}/${document.id}`}>
                <div className={'bg-card drop-shadow aspect-[3/4] p-4 rounded-md text-[0.6rem] text-gray-600 ' +
                    'transition hover:bg-gray-50 text-left'}>
                    <p className={'aspect-[3/4] whitespace-pre-wrap overflow-hidden'}>
                        {document.contents}
                    </p>
                </div>
            </Link>
            <div className={'flex flex-row justify-between items-center'}>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-gray-700 text-base'}>
                        {document.title}
                    </p>
                    <p className={'text-gray-600 text-sm'}>
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
                                    <Trash2Icon className='h-4 w-4 mr-2'/>Remove
                                </MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            </div>
        </div>
    )
}

export function SkeletonDocumentItem() {
    return (
        <div className={'flex flex-col gap-3'}>
            <Skeleton className={'aspect-[3/4] p-4'}/>
            <div className={'flex flex-row justify-between items-center'}>
                <div className={'flex flex-col gap-1 w-full'}>
                    <Skeleton className={'w-3/5 h-4'}/>
                    <Skeleton className={'w-2/5 h-3'}/>
                </div>
                <div>
                    <Skeleton className={'h-6 w-6'}/>
                </div>
            </div>
        </div>
    )
}
