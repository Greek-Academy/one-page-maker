import { Navigate, useLocation } from "react-router-dom";
import React from "react";
import { useAppSelector } from "./redux/hooks";
import { userApi } from "./api/userApi.ts";
import SetId from "./pages/SetId.tsx";

type Props = {
    component: React.ReactNode
    redirect: string
}

export const RouteAuthGuard = (props: Props) => {
    const user = useAppSelector((state) => state.user.user);
    const location = useLocation()
    const { data: result, status } = userApi.useFindUserByUIDQuery(user?.uid ?? "");

    if (!user) {
        return <Navigate to={props.redirect} state={{ from: location }} replace={false} />
    }

    if (status === 'error') {
        return <div>Error fetching user data. Please retry.</div>
    }

    if (status === 'success' && !result) {
        // Login success but not found user ID in database
        return <SetId />
    }

    if (status === 'success' && result) {
        // Login success
        return <>{props.component}</>
    }

    // if status is pending
    return <div>Loading...</div>;
}
