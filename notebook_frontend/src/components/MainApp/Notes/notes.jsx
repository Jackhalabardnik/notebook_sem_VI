import {useState} from "react";
import {Alert, FloatingLabel, Form} from "react-bootstrap";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";

const notebook_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).label('Name'),
    category: yup.string().required().label('Category Id'),
    notebook: yup.string().required().label('Notebook Id'),
});

const Notes = (props) => {
    const [note_name_error, setNote_name_error] = useState('')

    const note_name_form = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: notebook_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.post("http://localhost:8080/api/note", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    props.setNotes([...props.notes, response.data])
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setNote_name_error(error.response.data)
                    }
                })
        },
    });

    const handleChange = (change) => {
        note_name_form.handleChange(change)
        setTimeout(() => note_name_form.setErrors({}), 3000);
        setTimeout(() => note_name_form.resetForm({}), 10000);
    };

    return (<div className="col-12 col-md-2 h-100">
        <ul className="list-unstyled ">
            {props.notes.map((note, index) => (
                <li key={index}>
                    {note.text}
                </li>))}
            <li>
                <Form onSubmit={note_name_form.handleSubmit} noValidate>
                    <FloatingLabel controlId="inputUserName" label="New category" className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            value={note_name_form.values.name}
                            isInvalid={note_name_form.touched.name && !!note_name_form.errors.name}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{note_name_form.errors.name}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
                {note_name_error &&
                    <Alert variant="danger" className="text-center m-2">Error: {note_name_error}</Alert>}
            </li>
        </ul>
    </div>);
};

export default Notes;