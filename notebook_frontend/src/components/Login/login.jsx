import {useState} from "react"
import axios from "axios"
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap"
import { useFormik } from 'formik';
import * as yup from "yup";

const loginValidationSchema = yup.object().shape({
    email: yup.string().email().required().label('Email'),
    password: yup.string().required().label('Password')
});

const Login = () => {
    const [error, setError] = useState('')

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginValidationSchema,
        onSubmit: values => {
            axios.post("http://localhost:8080/api/auth/login", values)
                .then(response => {
                    localStorage.setItem("token", response.data);
                    window.location = "/";
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setError(error.response.data)
                    }
                })
        },
    });

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate className="p-3">
                <div className="d-flex flex-column flex-md-row  justify-content-end">
                    <FloatingLabel controlId="inputUserName" label="Email" className="me-md-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            isInvalid={formik.touched.email && !!formik.errors.email}
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold bg-dark text-center bg-opacity-75 rounded-3 text-white" >{formik.errors.email}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Password" className="me-md-3 my-md-0 my-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            isInvalid={formik.touched.password && !!formik.errors.password}
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold bg-dark text-center bg-opacity-75 rounded-3 text-white" >{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button type="submit" variant="primary" className="col-lg-3 col-md-4 col-12 col-xl-3 border-1 border-white">Sign In</Button>
                </div>
            </Form>
            {error && <Alert variant="danger" className="text-center m-2">Error: {error}</Alert> }
        </div>
    )
}
export default Login;