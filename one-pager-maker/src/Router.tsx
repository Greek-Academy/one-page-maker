import { Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import { RouteAuthGuard } from "./RouteAuthGuard";
import SetId from "@/pages/SetId.tsx";

export const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteAuthGuard
            component={<List />}
            redirect="/login"
            status={"user-data-created"}
          />
        }
      />
      <Route
        path="/edit/:uid/:documentId"
        element={
          <RouteAuthGuard
            component={<Edit />}
            redirect="/login"
            status={"user-data-created"}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="set-id"
        element={
          <RouteAuthGuard
            component={<SetId />}
            redirect={"/login"}
            status={"authenticated"}
          />
        }
      />
    </Routes>
  );
};
