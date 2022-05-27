import {useState} from "react"
import axios from "axios"
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap"
import {useFormik} from 'formik';
import * as yup from "yup";
import {Link} from "react-router-dom";
import ConfirmModal from "../Modals/confirm_modal";

const updateUserValidationSchema = yup.object().shape({
    username: yup.string().label('Username'),
    email: yup.string().email().label('Email'),
    old_password: yup.string().label('Old Password'),
    password: yup.string().label('Password'),
    r_password: yup.string()
        .when("password", {
            is: (val: any) => (val && val.length > 0),
            then: yup.string().oneOf(
                [yup.ref("password")],
                "Both password need to be the same"
            ).required(),
        }).label('Repeat Password'),
});

const UserEdit = () => {
    const [error, setError] = useState('')
    const [delete_modal_open, setDelete_modal_open] = useState(false)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
            email: '',
            password: '',
            old_password: '',
            r_password: '',
        },
        validationSchema: updateUserValidationSchema,
        onSubmit: async values => {
            const token = localStorage.getItem("token")
            await axios.put("http://localhost:8080/api/users", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    localStorage.setItem("token", response.data);
                    window.location = "/";
                })
                .catch(error => {
                    console.log(error)
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setError(error.response.data)
                    }
                })
        },
    });

    const delete_account = async () => {
        const token = localStorage.getItem("token")
        await axios.delete("http://localhost:8080/api/users", {headers: {"authorization": `${token}`}})
            .then(response => {
                localStorage.removeItem("token")
                window.location = "/"
            })
            .catch(error => {
                console.log(error)
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    setError(error.response.data)
                }
            })
    }

    return (
        <div className="col-12 col-md-6">
            {
                delete_modal_open &&
                <ConfirmModal
                    title = "Are you sure you want to remove this account? This action can't be undone."
                    onConfirm = {() => {
                        delete_account().then(r => {
                            setDelete_modal_open(false)
                        })
                    }}
                    onCancel = {() => setDelete_modal_open(false)}
                />
            }
            <Form onSubmit={formik.handleSubmit} noValidate>
                <div>
                    <FloatingLabel controlId="inputUserName" label="New username" className="mb-3">
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="New username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            isInvalid={formik.touched.username && !!formik.errors.username}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.username}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputUserName" label="New email" className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="New email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            isInvalid={formik.touched.email && !!formik.errors.email}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.email}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Old password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="old_password"
                            placeholder="Old password"
                            onChange={formik.handleChange}
                            value={formik.values.old_password}
                            isInvalid={formik.touched.old_password && !!formik.errors.old_password}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.old_password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="New password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="New password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            isInvalid={formik.touched.password && !!formik.errors.password}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel controlId="inputPassword" label="Retype new password" className="mb-3">
                        <Form.Control
                            type="password"
                            name="r_password"
                            placeholder="Retype new password"
                            onChange={formik.handleChange}
                            value={formik.values.r_password}
                            isInvalid={formik.touched.r_password && !!formik.errors.r_password}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{formik.errors.r_password}</Form.Control.Feedback>
                    </FloatingLabel>
                    <Button type="submit" variant="primary" className="col-12">Update your data</Button>
                    <Link to="/">
                        <Button variant="secondary" className="w-100 my-3">
                            Go back
                        </Button>
                    </Link>
                </div>
            </Form>
            {error && <Alert variant="danger" className="text-center m-2">Error: {error}</Alert>}
            <div className="mt-5 bg-danger bg-opacity-50 p-5 text-center">
                <div className="fs-5 fw-bold mb-2">
                    Danger Zone:
                </div>
                <Button type="button" variant="danger" className="col-12" onClick={() => setDelete_modal_open(true)}>Delete account</Button>
            </div>
        </div>);
};
export default UserEdit;