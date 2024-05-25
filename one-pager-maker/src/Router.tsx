import { Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import { RouteAuthGuard } from "./RouteAuthGuard";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<RouteAuthGuard component={<List />} redirect='/login' />} />
            <Route path="/edit/:uid/:documentId" element={<RouteAuthGuard component={<Edit />} redirect='/login' />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    );
}
