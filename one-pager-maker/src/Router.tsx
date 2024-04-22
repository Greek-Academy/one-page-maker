import { Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit";
import List from "./pages/List";
import Login from "./pages/Login";

export const Router = () => {
    return (
        <Routes>
            <Route path="/edit/:id" element={<Edit/>}/>
            <Route path="/list" element={<List/>}/>
            <Route path="/login" element={<Login/>}/>
        </Routes>
    );
}