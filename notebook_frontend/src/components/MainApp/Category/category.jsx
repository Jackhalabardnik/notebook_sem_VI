import {useState} from "react";
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap";
import Notebook from "../Notebook/notebook";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";

const category_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).label('Name'),
});

const Category = (props) => {
    const [open_categories, setOpen_categories] = useState(props.open_categories)
    const [category_name_error, setCategory_name_error] = useState('')

    const switch_category = (category_name) => {
        if (open_categories.includes(category_name)) {
            setOpen_categories(open_categories.filter(category => category !== category_name))
        } else {
            setOpen_categories([...open_categories, category_name])
        }
    }

    const category_name_form = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: category_validation_schema,
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

    const handleChange = (change) => {
        category_name_form.handleChange(change)
        setTimeout(() => category_name_form.setErrors({}), 3000);
        setTimeout(() => category_name_form.resetForm({}), 10000);
    };

    const delete_category = (category_id) => {
        const token = localStorage.getItem("token")
        axios.delete(`http://localhost:8080/api/category/`,  { data: {id: category_id}, headers: {"authorization": `${token}`}})
            .then(() => {
                props.setCategories(props.categories.filter(category => category !== category_id))
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (<div className="col-12 col-md-2 h-100">
        <ul className="list-unstyled ">
            {props.categories.map((category, index) => (
                <li key={index}>
                    <div className={ "d-flex justify-content-between bg-dark " + ( open_categories.includes(category.name) ?
                        "bg-opacity-75" : "bg-opacity-25" )}>
                        <Button className= {"bg-transparent border-0 shadow-none rounded-0 text-start w-100 " + (open_categories.includes(category.name) ? "text-white" : "text-dark")}
                                onClick={() => switch_category(category.name)}
                        >
                            {category.name}

                        </Button>
                        {
                            open_categories.includes(category.name) &&
                            <div className="d-flex">
                                <Button variant="secondary" className="shadow-none rounded-0" type="button" data-toggle="tooltip"
                                        data-placement="top" title="Delete">
                                    <img src="/pencil-square.svg" alt="Trash icon" style={{filter: "invert(100%)" }}></img>
                                </Button>
                                <Button variant="danger" className="shadow-none rounded-0" type="button" data-toggle="tooltip"
                                        data-placement="top" title="Delete" onClick={delete_category(category._id)}>
                                    <img src="/trash3.svg" alt="Trash icon" style={{filter: "invert(100%)" }}></img>
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
                <Form onSubmit={category_name_form.handleSubmit} noValidate>
                    <FloatingLabel controlId="inputUserName" label="New category" className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            value={category_name_form.values.name}
                            isInvalid={category_name_form.touched.name && !!category_name_form.errors.name}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{category_name_form.errors.name}</Form.Control.Feedback>
                    </FloatingLabel>
                </Form>
                {category_name_error &&
                    <Alert variant="danger" className="text-center m-2">Error: {category_name_error}</Alert>}
            </li>
        </ul>
    </div>);
};

export default Category;