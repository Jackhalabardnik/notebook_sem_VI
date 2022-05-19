import {useState} from "react"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"

const Signup = () => {
    const [data, setData] = useState({
        username: "", email: "", password: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = "http://localhost:8080/api/auth/signup"
            await axios.post(url, data)
            navigate("/login")
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message)
            }
        }
    }
    return (<div>
        <div>
            <div>
                <h1>Witaj z powrotem</h1>
                <Link to="/login">
                    <button type="button">
                        Sing in
                    </button>
                </Link>
            </div>
            <div>
                <form
                    onSubmit={handleSubmit}>
                    <h1>Zakładanie konta</h1>
                    <input
                        type="text"
                        placeholder="Nazwa użytkownika"
                        name="username"
                        onChange={handleChange}
                        value={data.firstName}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                        value={data.email}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        name="password"
                        onChange={handleChange}
                        value={data.password}
                        required
                    />
                    {error && <div>{error}</div>}
                    <button type="submit">
                        Zaloguj się
                    </button>
                </form>
            </div>
        </div>
    </div>);
};
export default Signup