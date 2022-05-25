import {Alert, FloatingLabel, Form} from "react-bootstrap";
import {useFormik} from "formik";
import axios from "axios";
import {useState} from "react";
import * as yup from "yup";

const notebook_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).label('Name'),
    category: yup.string().required().label('Id'),
});

const Notebook = (props) => {
    const [notebook_name_error, setNotebook_name_error] = useState('')



    const notebook_name_form = useFormik({
        initialValues: {
            name: '',
            category: props.category._id,
        },
        validationSchema: notebook_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.post("http://localhost:8080/api/notebook", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    props.setNotebooks([...props.notebooks, response.data])
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setNotebook_name_error(error.response.data)
                    }
                })
            notebook_name_form.resetForm()
        },
    });

    const handleChange = (change) => {
        notebook_name_form.handleChange(change)
        setTimeout(() => notebook_name_form.setErrors({}), 3000);
        setTimeout(() => notebook_name_form.resetForm({}), 10000);
    };

    return (
        <ul className="list-unstyled bg-dark bg-opacity-10 text-dark">
            <div className="ms-3">
                {props.notebooks.filter(notebook => notebook.category === props.category._id).map((notebook, index) => (
                    <li key={index} className="p-1">
                        {notebook.name}
                    </li>
                ))}
                <li>
                    <Form onSubmit={notebook_name_form.handleSubmit} noValidate>
                        <FloatingLabel controlId="inputUserName" label="New notebook" className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={handleChange}
                                value={notebook_name_form.values.name}
                                isInvalid={notebook_name_form.touched.name && !!notebook_name_form.errors.name}
                            />

                            <Form.Control.Feedback type="invalid"
                                                   className="fw-bold">{notebook_name_form.errors.name}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form>
                    {notebook_name_error &&
                        <Alert variant="danger" className="text-center m-2">Error: {notebook_name_error}</Alert>}
                </li>
            </div>
        </ul>
    );
}

export default Notebook;