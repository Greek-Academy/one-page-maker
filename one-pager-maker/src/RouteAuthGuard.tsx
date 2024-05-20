import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useAppSelector } from "./redux/hooks";
import { userApi } from "./api/userApi.ts";

type Props = {
    component: React.ReactNode
    redirect: string
}

export const RouteAuthGuard = (props: Props) => {
    const user = useAppSelector((state) => state.user.user);
    console.log(user)
    const { data: result, error: err } = userApi.useFindUserByUIDQuery(user?.uid ?? "");
    console.log(result)
    console.log(err)
    if (!user) {
        return <Navigate to={props.redirect} state={{ from: useLocation() }} replace={false} />
    }
    if (result === undefined) {
        return <Navigate to={'/set-id'} />
    }

    return <>{props.component}</>
}
