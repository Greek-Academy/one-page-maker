import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useAppSelector } from "./redux/hooks";

type Props = {
    component: React.ReactNode
    redirect: string
}

export const RouteAuthGuard = (props: Props) => {
    const user = useAppSelector((state) => state.user.user);

    if (!user) {
        return <Navigate to={props.redirect} state={{ from: useLocation() }} replace={false} />
    }

    return <>{props.component}</>
}
