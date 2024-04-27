import { Route, Routes } from "react-router-dom";
import Edit from "./pages/Edit";
import List from "./pages/List";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<List/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
        </Routes>
    );
}