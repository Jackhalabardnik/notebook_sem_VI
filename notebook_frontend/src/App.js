import { Route, Routes, Navigate } from "react-router-dom"
import Main from "./components/Main/main"
import Signup from "./components/Signup/signup"
import Front from "./components/Front/front";
function App() {
    const user = localStorage.getItem("token")
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/signup" exact element={<Signup />} />
            <Route path="/front" exact element={<Front />} />
            <Route path="/*" element={<Navigate replace to="/front" />} />
        </Routes>
    )
}
export default App