import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";

export const SignInRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
        </Routes>
    );
}
