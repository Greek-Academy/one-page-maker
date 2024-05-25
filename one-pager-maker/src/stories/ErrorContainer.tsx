import {ReactNode} from "react";

export default function ErrorContainer({children}: {
    children: ReactNode
}) {
    return (
        <div className={"flex flex-col rounded-md p-8" +
            " border border-red-500 bg-red-50" +
            " text-red-900 "}>
            {children}
        </div>
    )
}
