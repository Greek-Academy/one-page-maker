import { Route, Routes } from "react-router-dom";
import Edit from "./Edit";
import List from "./List";

export const Router = () => {
    return (
        <Routes>
            <Route path="/Edit" element={<Edit/>}/>
            <Route path="/List" element={<List/>}/>

            {/* <Route path="/page1" element={<Layout/>}>
                <Route index element={<Page1/>}/>
                <Route path="child" element={<Page1Child/>}/>
            </Route>
            <Route path="/page2" element={<Page2/>}/> */}

            {/* <Route path="*" element={<Page404/>}/> */}
        </Routes>
    );
}