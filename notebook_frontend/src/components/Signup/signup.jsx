import {useState} from "react"
import axios from "axios"
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap"
import {useFormik} from 'formik';
import * as yup from "yup";

const signupValidationSchema = yup.object().shape({
    username: yup.string().required().label('Username'),
    email: yup.string().email().required().label('Email'),
    password: yup.string().required().label('Password')
});

const Signup = () => {
    const [error, setError] = useState('')

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: signupValidationSchema,
        onSubmit: values => {
            axios.post("http://localhost:8080/api/auth/signup", values)
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
            <Form onSubmit={formik.handleSubmit} noValidate className="px-3">
                <div>
                    <FloatingLabel controlId="inputUserName" label="Username" className="mb-3 text-white">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            isInvalid={formik.touched.username && !!formik.errors.username}
                            className="shadow-none bg-light bg-opacity-10 border-0 text-white"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputUserName" label="Email" className="mb-3 text-white">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            isInvalid={formik.touched.email && !!formik.errors.email}
                            className="shadow-none bg-light bg-opacity-10 border-0 text-white"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.email}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Password" className="mb-3 text-white">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            isInvalid={formik.touched.password && !!formik.errors.password}
                            className="shadow-none bg-light bg-opacity-10 border-0 text-white"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button type="submit" variant="primary" className="col-12">Sign Up Now</Button>
                </div>
            </Form>
            {error && <Alert variant="danger" className="text-center m-2">Error: {error}</Alert>}
        </div>);
};
export default Signup