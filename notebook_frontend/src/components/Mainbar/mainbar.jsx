import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const MainBar = () => {

    const [userData, setUserData] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:8080/api/users/logged_in`, {headers: {"authorization": `${token}`}})
            .then((response) => {
                setUserData(response.data)
            }).catch((error) => {
            console.log(error)
        })
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }
    return (
        <nav className="bg-primary d-flex justify-content-between flex-column flex-md-row align-items-center">
            <Link to="/" className="ms-md-2 my-3 text-white text-center text-decoration-none fs-3 fw-bold">
                    Notebook
            </Link>
            <div className="d-flex flex-column flex-md-row justify-content-between mx-3 align-items-center">
                <div className="text-white fs-5 d-flex align-items-center">
                    Hello
                    <div className="fw-bold fs-4 mx-1">
                        {userData.username}
                    </div>
                    !
                </div>

                <Link to="/user" className="m-3">
                    <Button variant="outline-light">
                        Settings
                    </Button>
                </Link>

                <Button onClick={handleLogout} variant="outline-light mb-3 mb-md-0">
                    Log out
                </Button>
            </div>
        </nav>
    )
}
export default MainBar