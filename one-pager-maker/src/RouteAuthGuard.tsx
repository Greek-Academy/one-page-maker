import { Navigate, useLocation } from "react-router-dom";
import React from "react";

import { useAppSelector } from "./redux/hooks";
import { Loader2 } from "lucide-react";
import { userApi } from "@/api/userApi.ts";

type Props = {
    component: React.ReactNode
    redirect: string
    status: 'user-data-created' | 'authenticated' | 'unauthenticated'
}

export const RouteAuthGuard = ({ component, redirect, status = 'user-data-created' }: Props) => {
    const userState = useAppSelector((state) => state.user);
    const userQuery = userApi.useFindUserByUIDQuery(userState.data.user?.uid ?? '');
    const shouldCreateUserData = status === 'user-data-created';
    const location = useLocation();

    if (userState.status === 'pending' || (shouldCreateUserData && userQuery.status === 'pending')) {
        return (
            <main className={'w-screen h-screen flex flex-col justify-center items-center'}>
                <Loader2 className="h-8 w-8 animate-spin" />
            </main>
        )
    }

    if (userState.status === 'error' || (shouldCreateUserData && userQuery.status === 'error')) {
        return (
            <main>
                {userState.error?.message}
                {shouldCreateUserData && userQuery.error?.message}
            </main>
        )
    }

    if (userState.status === 'success' && userState.data.user === null) {
        return <Navigate to={redirect} state={{ from: location }} replace={false} />
    }

    if (shouldCreateUserData && userQuery.status === 'success' && userQuery.data === null) {
        return <Navigate to={'/set-id'} state={{ from: location }} replace={false} />
    }

    // success and user isn't null
    return <>{component}</>
}
