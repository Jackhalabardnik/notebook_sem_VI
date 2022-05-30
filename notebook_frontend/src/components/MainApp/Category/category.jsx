import {useEffect, useState} from "react";
import Notebook from "../Notebook/notebook";
import MenuButton from "../MenuButton/menubutton";
import ConfirmModal from "../../Modals/confirm_modal";
import NewStringForm from "../NewNameForm/newStringForm";
import EditModal from "../../Modals/edit_modal";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";

const new_category_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).max(50).label('Name'),
});

const edit_category_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).max(50).label('Name'),
    category_id: yup.string().required().label('Category Id')
});

const Category = (props) => {
    const [open_categories, setOpen_categories] = useState(props.open_categories)
    const [category_name_error, setCategory_name_error] = useState('')
    const [category_edit_name_error, setCategory_edit_name_error] = useState('')
    const [edit_modal_open, setEdit_modal_open] = useState(false)
    const [delete_modal_open, setDelete_modal_open] = useState(false)
    const [delete_category_id, setDelete_category_id] = useState('')
    const [category_form_timeout_id, setCategory_form_timeout_id] = useState(null)


    useEffect(() => {
        if (!!props.active_notebook && open_categories.includes(-1)) {
            const active_category = props.categories.find(category => category._id === props.active_notebook.category)
            setOpen_categories([active_category.name])
        }

    }, [props.active_notebook, props.categories, open_categories])

    const switch_category = (category_name) => {
        if (open_categories.includes(category_name)) {
            setOpen_categories(open_categories.filter(category => category !== category_name || category === -1))
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
                    new_category_name_form.resetForm()
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
            axios.put(`http://localhost:8080/api/category/${edit_category_name_form.values.category_id}`, values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    const categories = [...props.categories]
                    const index = categories.findIndex(category => category._id === edit_category_name_form.values.category_id)
                    categories.splice(index, 1, response.data)
                    props.setCategories(categories)
                    setEdit_modal_open(false)
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setCategory_edit_name_error(error.response.data)
                    }
                })
        },
    });

    const handleChange = (change) => {
        new_category_name_form.handleChange(change)
        if (category_form_timeout_id) {
            clearTimeout(category_form_timeout_id)
        }
        setCategory_form_timeout_id(setTimeout(() => new_category_name_form.setErrors({}), 10000));
    };

    const delete_category = (category_id) => {
        const token = localStorage.getItem("token")
        axios.delete(`http://localhost:8080/api/category/${category_id}`, {
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

    const open_delete_category_modal = (category_id) => {
        setDelete_category_id(category_id);
        setDelete_modal_open(true);
    }

    return (<div className="col-12 col-md-4 col-lg-3 col-xl-2 d-flex flex-column justify-content-between bg-dark bg-opacity-25">
        {
            delete_modal_open &&
            <ConfirmModal
                modal_title="Are you sure you want to delete this category?"
                onConfirm={() => {
                    delete_category(delete_category_id)
                    setDelete_modal_open(false)
                }}
                onCancel={() => setDelete_modal_open(false)}
            />
        }
        {
            edit_modal_open &&
            <EditModal
                modal_title = "Edit category name"
                edit_form={edit_category_name_form}
                name="name"
                name_label="New category name"
                value={edit_category_name_form.values.name}
                isInvalid={edit_category_name_form.touched.name && edit_category_name_form.errors.name}
                onChange={edit_category_name_form.handleChange}
                form_style="shadow-none bg-light bg-opacity-25 border-0 text-white"
                form_error={edit_category_name_form.errors.name}
                edit_error={category_edit_name_error}
                onCancel={() => setEdit_modal_open(false)}
            />
        }
        <ul className="list-unstyled overflow-scroll">
            {props.categories.map((category, index) => (
                <li key={index} className="mt-1 mx-1">
                    <MenuButton
                        is_highlighted_mode={open_categories.includes(category.name)}
                        highlighted_bg="bg-dark bg-opacity-75 text-white rounded-1"
                        not_highlighted_bg="text-white"
                        main_button_on_click={() => switch_category(category.name)}
                        main_button_text={"# " + category.name}
                        edit_button_on_click={() => open_edit_category_modal(category._id, category.name)}
                        delete_button_on_click={() => open_delete_category_modal(category._id)}
                    />
                    {
                        open_categories.includes(category.name) &&
                        <Notebook
                            category={category}
                            notebooks={props.notebooks}
                            setNotebooks={props.setNotebooks}
                            active_notebook={props.active_notebook}
                            setActiveNotebook={props.setActiveNotebook}
                        />
                    }
                </li>))}
        </ul>
        <div className="m-2 mb-3">
            <NewStringForm
                name_form={new_category_name_form}
                name="name"
                name_label="New category name"
                value={new_category_name_form.values.name}
                isInvalid={new_category_name_form.touched.name && new_category_name_form.errors.name}
                onChange={handleChange}
                form_style="shadow-none bg-light bg-opacity-25 border-0 text-white"
                div_style="col-12 col-sm-4 col-md-12"
                form_error={new_category_name_form.errors.name}
                name_error={category_name_error}
            />
        </div>
    </div>);
};

export default Category;