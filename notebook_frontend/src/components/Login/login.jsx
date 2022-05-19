import {useState} from "react"
import axios from "axios"
import {Button, FloatingLabel, Form} from "react-bootstrap"

const Login = () => {
    const [data, setData] = useState({email: "", password: ""})
    const [error, setError] = useState("")
    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = "http://localhost:8080/api/auth/login"
            const {data: res} = await axios.post(url, data)
            localStorage.setItem("token", res)
            window.location = "/"
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
            }
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit} noValidate className="p-3">
                <div className="d-flex justify-content-end">
                    <FloatingLabel controlId="inputUserName" label="Username" className="me-3">
                        <Form.Control
                            type="text"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            value={data.email}
                            isInvalid={error}
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Password" className="me-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={data.password}
                            isInvalid={error}
                        />
                        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button type="submit" variant="primary" className="col-2 border-1 border-white">Sign In</Button>
                </div>
            </Form>
        </div>
    )
}
export default Login;