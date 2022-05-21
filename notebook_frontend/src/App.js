import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main/main"
import Front from "./components/Front/front";
import UserSettings from "./components/Settings/usersettings";

function App() {
    const user = localStorage.getItem("token")
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            {user && <Route path="/user" exact element={<UserSettings />} />}
            <Route path="/front" exact element={<Front />} />
            <Route path="/*" element={<Navigate replace to="/front" />} />
        </Routes>
    )
}
export default App