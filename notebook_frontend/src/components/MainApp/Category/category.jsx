import {useState} from "react";
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap";
import Notebook from "../Notebook/notebook";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";

const new_category_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).label('Name'),
});

const edit_category_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).label('Name'),
    category_id: yup.string().required().label('Category Id')
});

const Category = (props) => {
    const [open_categories, setOpen_categories] = useState(props.open_categories)
    const [category_name_error, setCategory_name_error] = useState('')
    const [edit_modal_open, setEdit_modal_open] = useState(false)

    const switch_category = (category_name) => {
        if (open_categories.includes(category_name)) {
            setOpen_categories(open_categories.filter(category => category !== category_name))
        } else {
            setOpen_categories([...open_categories, category_name])
        }
    }

    const new_category_name_form = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: new_category_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.post("http://localhost:8080/api/category", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    props.setCategories([...props.categories, response.data])
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setCategory_name_error(error.response.data)
                    }
                })
        },
    });

    const edit_category_name_form = useFormik({
        initialValues: {
            name: '',
            category_id: ''
        },
        validationSchema: edit_category_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.put("http://localhost:8080/api/category", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    const categories = [...props.categories]
                    const index = categories.findIndex(category => category._id === edit_category_name_form.values.category_id)
                    categories.splice(index, 1, response.data)
                    props.setCategories(categories)
                    setEdit_modal_open(false)
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setCategory_name_error(error.response.data)
                    }
                })
        },
    });

    const handleChange = (change) => {
        new_category_name_form.handleChange(change)
        setTimeout(() => new_category_name_form.setErrors({}), 3000);
        setTimeout(() => new_category_name_form.resetForm({}), 10000);
    };

    const delete_category = (category_id) => {
        const token = localStorage.getItem("token")
        axios.delete(`http://localhost:8080/api/category/`, {
            data: {id: category_id},
            headers: {"authorization": `${token}`}
        })
            .then(() => {
                props.setCategories(props.categories.filter(category => category._id !== category_id))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const open_edit_category_modal = (category_id, category_name) => {
        edit_category_name_form.setValues({name: category_name, category_id: category_id})
        setEdit_modal_open(true)
    }

    return (<div className="col-12 col-md-2 h-100">
        {
            edit_modal_open && <div className="modal-backdrop fade show d-flex justify-content-center align-items-center">
                <div className="bg-white text-center text-dark p-5">
                    <Form onSubmit={edit_category_name_form.handleSubmit} noValidate>
                        <FloatingLabel controlId="edit_category_name" label="Edit category" className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={edit_category_name_form.handleChange}
                                value={edit_category_name_form.values.name}
                                isInvalid={edit_category_name_form.touched.name && !!edit_category_name_form.errors.name}
                            />
                            <Form.Control.Feedback type="invalid"
                                                   className="fw-bold">{edit_category_name_form.errors.name}</Form.Control.Feedback>
                        </FloatingLabel>
                        <div className="d-flex">
                            <Button variant="primary" type="submit" > Edit </Button>
                            <Button variant="secondary" onClick={() => setEdit_modal_open(false)}> Cancel </Button>
                        </div>
                    </Form>
                    {category_name_error &&
                        <Alert variant="danger" className="text-center m-2">Error: {category_name_error}</Alert>}
                </div>
            </div>
        }
        <ul className="list-unstyled ">
            {props.categories.map((category, index) => (
                <li key={index}>
                    <div
                        className={"d-flex justify-content-between bg-dark " + (open_categories.includes(category.name) ?
                            "bg-opacity-75" : "bg-opacity-25")}>
                        <Button
                            className={"bg-transparent border-0 shadow-none rounded-0 text-start w-100 " + (open_categories.includes(category.name) ? "text-white" : "text-dark")}
                            onClick={() => switch_category(category.name)}
                        >
                            {category.name}

                        </Button>
                        {
                            open_categories.includes(category.name) &&
                            <div className="d-flex">
                                <Button variant="secondary" className="shadow-none rounded-0" type="button"
                                        data-toggle="tooltip"
                                        data-placement="top" title="Delete" onClick={() => open_edit_category_modal(category._id, category.name)}>
                                    <img src="/pencil-square.svg" alt="Trash icon"
                                         style={{filter: "invert(100%)"}}></img>
                                </Button>
                                <Button variant="danger" className="shadow-none rounded-0" type="button"
                                        data-toggle="tooltip"
                                        data-placement="top" title="Delete"
                                        onClick={() => delete_category(category._id)}>
                                    <img src="/trash3.svg" alt="Trash icon" style={{filter: "invert(100%)"}}></img>
                                </Button>
                            </div>
                        }

                    </div>
                    {
                        open_categories.includes(category.name) &&
                        <Notebook
                            category={category}
                            notebooks={props.notebooks}
                            setNotebooks={props.setNotebooks}
                        />
                    }
                </li>))}
            <li>
                <Form onSubmit={new_category_name_form.handleSubmit} noValidate>
                    <FloatingLabel controlId="new_category_name" label="New category" className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            value={new_category_name_form.values.name}
                            isInvalid={new_category_name_form.touched.name && !!new_category_name_form.errors.name}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{new_category_name_form.errors.name}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
                {category_name_error &&
                    <Alert variant="danger" className="text-center m-2">Error: {category_name_error}</Alert>}
            </li>
        </ul>
    </div>);
};

export default Category;