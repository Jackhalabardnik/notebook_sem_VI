import {Alert, FloatingLabel, Form} from "react-bootstrap";
import {useFormik} from "formik";
import axios from "axios";
import {useState} from "react";
import * as yup from "yup";
import MenuButton from "../MenuButton/menubutton";
import ConfirmModal from "../../Modals/confirm_modal";
import EditModal from "../../Modals/edit_modal";
import NewNameForm from "../NewNameForm/newnameform";

const new_notebook_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).max(50).label('Name'),
    category: yup.string().required().label('Id'),
});

const edit_notebook_validation_schema = yup.object().shape({
    name: yup.string().required().min(3).max(50).label('Name'),
    notebook_id: yup.string().required().label('Category Id')
});

const Notebook = (props) => {
    const [notebook_name_error, setNotebook_name_error] = useState('')
    const [notebook_edit_name_error, setNotebook_edit_name_error] = useState('')
    const [edit_modal_open, setEdit_modal_open] = useState(false)
    const [delete_modal_open, setDelete_modal_open] = useState(false)
    const [delete_notebook_id, setDelete_notebook_id] = useState('')

    const notebook_name_form = useFormik({
        initialValues: {
            name: '',
            category: props.category._id,
        },
        validationSchema: new_notebook_validation_schema,
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

    const edit_notebook_name_form = useFormik({
        initialValues: {
            name: '',
            notebook_id: ''
        },
        validationSchema: edit_notebook_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.put(`http://localhost:8080/api/notebook/${edit_notebook_name_form.values.notebook_id}`, values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    const notebooks = [...props.notebooks]
                    const index = notebooks.findIndex(notebook => notebook._id === edit_notebook_name_form.values.notebook_id)
                    notebooks.splice(index, 1, response.data)
                    props.setNotebooks(notebooks)
                    setEdit_modal_open(false)
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setNotebook_edit_name_error(error.response.data)
                    }
                })
        },
    });

    const handleChange = (change) => {
        notebook_name_form.handleChange(change)
        setTimeout(() => notebook_name_form.setErrors({}), 10000);
    };

    const delete_notebook = (notebook_id) => {
        const token = localStorage.getItem("token")
        axios.delete(`http://localhost:8080/api/notebook/${notebook_id}`, {
            data: { id: notebook_id},
            headers: {"authorization": `${token}`}
        })
            .then(() => {
                props.setNotebooks(props.notebooks.filter(notebook => notebook._id !== notebook_id))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const open_edit_notebook_modal = (notebook_id, notebook_name) => {
        edit_notebook_name_form.setValues({name: notebook_name, notebook_id: notebook_id})
        setEdit_modal_open(true)
    }

    const open_delete_notebook_modal = (notebook_id) => {
        setDelete_notebook_id(notebook_id)
        setDelete_modal_open(true)
    }

    const is_notebook_highlighted = (notebook_id) => {
        return props.active_notebook._id === notebook_id
    }

    return (
        <ul className="list-unstyled bg-dark bg-opacity-10 text-dark">
            {
                delete_modal_open &&
                <ConfirmModal
                    title = "Are you sure you want to delete this notebook?"
                    onConfirm = {() => {
                        delete_notebook(delete_notebook_id)
                        setDelete_modal_open(false)
                    }}
                    onCancel = {() => setDelete_modal_open(false)}
                />
            }
            {
                edit_modal_open &&
                <EditModal
                    edit_category_name_form ={edit_notebook_name_form}
                    form_error ={notebook_edit_name_error}
                    onCancel = {() => setEdit_modal_open(false)}
                />
            }

            <div className="ms-3">
                {props.notebooks.filter(notebook => notebook.category === props.category._id).map((notebook, index) => (
                    <li key={index}>
                        <MenuButton
                            is_highlighted_mode = { is_notebook_highlighted(notebook._id) }
                            highlighted_bg = "bg-dark bg-opacity-50 text-white"
                            not_highlighted_bg = "bg-secondary bg-opacity-25 text-dark"
                            main_button_on_click = {() =>  {
                                props.setActiveNotebook(notebook)
                                localStorage.setItem("last_notebook_id", notebook._id)
                            }}
                            main_button_text = {notebook.name}
                            edit_button_on_click = {() => open_edit_notebook_modal(notebook._id, notebook.name)}
                            delete_button_on_click = {() => open_delete_notebook_modal(notebook._id) }
                        />
                    </li>
                ))}
                <li>
                    <NewNameForm
                        name_form = {notebook_name_form}
                        control_id = "inputUserName"
                        name_label = "New notebook name"
                        onChange = {handleChange}
                        name_error = {notebook_name_error}
                    />
                </li>
            </div>
        </ul>
    );
}

export default Notebook;