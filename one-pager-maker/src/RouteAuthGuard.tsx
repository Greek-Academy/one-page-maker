import { Navigate, useLocation } from "react-router-dom";
import React from "react";

import { useAppSelector } from "./redux/hooks";
import { Loader2 } from "lucide-react";
import { userApi } from "./api/userApi.ts";
import SetId from "./pages/SetId";

type Props = {
    component: React.ReactNode
    redirect: string
}

export const RouteAuthGuard = (props: Props) => {
    const userState = useAppSelector((state) => state.user);
    const location = useLocation()
    const { data: result, status: findStatus, error } = userApi.useFindUserByUIDQuery(userState?.data.user?.uid ?? "");

    console.log("Auth!")
    if (userState.status === 'pending') {
        return (
            <main className={'w-screen h-screen flex flex-col justify-center items-center'}>
                <Loader2 className="h-8 w-8 animate-spin" />
            </main>
        )
    }

    if (userState.status === 'error') {
        return (
            <main>
                {userState.error?.message}
            </main>
        )
    }

    if (userState.status === 'success' && userState.data.user === null) {
        return <Navigate to={props.redirect} state={{ from: location }} replace={false} />
    }

    if (findStatus === 'error') {
        return (
            <main>
                {error?.message}
            </main>
        )
    }
    console.log(result)
    if (findStatus === 'success' && !result) {
        // Login success but not found user ID in database
        return <SetId />
    }

    if (findStatus === 'success' && result) {
        // Login success
        return <>{props.component}</>
    }

    // if status is pending
    return (
        <main className={'w-screen h-screen flex flex-col justify-center items-center'}>
            <Loader2 className="h-8 w-8 animate-spin" />
        </main>
    )
}
