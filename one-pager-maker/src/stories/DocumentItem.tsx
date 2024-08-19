import { Document } from "../entity/documentType.ts";
import { EllipsisIcon, Trash2Icon } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";

export const DocumentItem = ({
  document,
  onDelete
}: {
  document: Document;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className={"flex flex-col gap-3"}>
      <Link to={`/edit/${document.owner_id}/${document.id}`}>
        <div
          className={
            "aspect-[3/4] rounded-md bg-card p-4 text-[0.6rem] text-gray-600 drop-shadow " +
            "text-left transition hover:bg-gray-50"
          }
        >
          <p className={"aspect-[3/4] overflow-hidden whitespace-pre-wrap"}>
            {document.contents}
          </p>
        </div>
      </Link>
      <div className={"flex flex-row items-center justify-between"}>
        <div className={"flex flex-col gap-1"}>
          <p className={"text-base text-gray-700"}>{document.title}</p>
          <p className={"text-sm text-gray-600"}>
            {document.updated_at.toDate().toLocaleString()}
          </p>
        </div>
        <div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className={"p-2"}>
                <EllipsisIcon className="h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => onDelete(document.id)}>
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Remove
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </div>
  );
};

export function SkeletonDocumentItem() {
  return (
    <div className={"flex flex-col gap-3"}>
      <Skeleton className={"aspect-[3/4] p-4"} />
      <div className={"flex flex-row items-center justify-between"}>
        <div className={"flex w-full flex-col gap-1"}>
          <Skeleton className={"h-4 w-3/5"} />
          <Skeleton className={"h-3 w-2/5"} />
        </div>
        <div>
          <Skeleton className={"h-6 w-6"} />
        </div>
      </div>
    </div>
  );
}
