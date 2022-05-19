import axios from "axios";
import {useEffect, useState} from "react";
import {Nav} from "react-bootstrap";

const Main = () => {

    const [userData, setUserData] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:8080/api/users/logged_in`, { headers: { "authorization" : `${token}` } })
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
        <div>
            <Nav>
                <h1>MySite</h1>
                <p>
                    Hello: {userData.username}
                </p>
                <button onClick={handleLogout}>
                    Wyloguj się
                </button>
            </Nav>
        </div>
    )
}
export default Main