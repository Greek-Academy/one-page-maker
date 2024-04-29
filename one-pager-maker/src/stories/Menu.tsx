import {Fragment, ReactNode} from "react";

export const Menu = ({open, children}: {
    open: boolean,
    children: ReactNode,
}) => {
    if (!open) {
        return (
            <Fragment/>
        );
    }

    return (
        <menu className={'absolute bg-slate-200 rounded-md z-10'}>
            {children}
        </menu>
    )
}

export const MenuItem = ({children}: {
    children: ReactNode
}) => {
    return (
        <li className={'hover:bg-slate-300 rounded-md px-6 py-4'}>
            {children}
        </li>
    )
}