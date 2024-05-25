import {Navigate, useLocation} from "react-router-dom";
import React from "react";
import {useAppSelector} from "./redux/hooks";
import {Loader2} from "lucide-react";

type Props = {
    component: React.ReactNode
    redirect: string
}

export const RouteAuthGuard = (props: Props) => {
    const userState = useAppSelector((state) => state.user);

    if (userState.status === 'pending') {
        return (
            <main className={'w-screen h-screen flex flex-col justify-center items-center'}>
                <Loader2 className="h-8 w-8 animate-spin"/>
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
        return <Navigate to={props.redirect} state={{ from: useLocation() }} replace={false} />
    }

    // success and user isn't null
    return <>{props.component}</>
}
