import {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";
import MenuButton from "../MenuButton/menubutton";
import NewStringForm from "../NewNameForm/newStringForm";
import EditModal from "../../Modals/edit_modal";
import ConfirmModal from "../../Modals/confirm_modal";

const note_validation_schema = yup.object().shape({
    text: yup.string().required().min(1).max(2000).label('Text'),
    category_id: yup.string().required().label('Category Id'),
    notebook_id: yup.string().required().label('Notebook Id'),
});

const edit_note_validation_schema = yup.object().shape({
    text: yup.string().required().min(1).max(2000).label('Name'),
    note_id: yup.string().required().label('Note Id'),
});

const Notes = (props) => {
    const [note_name_error, setNote_name_error] = useState('')
    const [note_form_timeout_id, setNote_form_timeout_id] = useState(null)
    const [edit_modal_open, setEdit_modal_open] = useState(false)
    const [delete_modal_open, setDelete_modal_open] = useState(false)
    const [delete_note_id, setDelete_note_id] = useState('')
    const [note_edit_name_error, setNote_edit_name_error] = useState('')
    const down_message_ref = useRef(null)

    const [do_scrolling, setDo_scrolling] = useState(true);

    const scroll_bottom = () => {
        down_message_ref.current.scrollIntoView({
            block: "nearest",
            inline: "center"
        })
    }

    useEffect(() => {
        if (do_scrolling) {
            scroll_bottom()
        }
        setDo_scrolling(true);
        // eslint-disable-next-line
    }, [props.notes])


    const note_name_form = useFormik({
        initialValues: {
            text: '',
            category_id: '',
            notebook_id: '',
        },
        validationSchema: note_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.post("http://localhost:8080/api/note", values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    props.setNotes([...props.notes, response.data])
                    note_name_form.resetForm()
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setNote_name_error(error.response.data)
                    }
                })
        },
    });

    const edit_note_name_form = useFormik({
        initialValues: {
            text: '',
            note_id: '',
        },
        validationSchema: edit_note_validation_schema,
        onSubmit: values => {
            const token = localStorage.getItem("token")
            axios.put(`http://localhost:8080/api/note/${edit_note_name_form.values.note_id}`, values, {headers: {"authorization": `${token}`}})
                .then(response => {
                    const notes = [...props.notes]
                    const index = notes.findIndex(note => note._id === edit_note_name_form.values.note_id)
                    notes.splice(index, 1, response.data)
                    setDo_scrolling(false);
                    props.setNotes(notes)
                    setEdit_modal_open(false)
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setNote_edit_name_error(error.response.data)
                    }
                })
        },
    });

    const handleChange = (change) => {

        if (props.active_notebook) {
            note_name_form.setValues({
                category_id: props.active_notebook.category,
                notebook_id: props.active_notebook._id,
            })
        }

        note_name_form.handleChange(change)
        if (note_form_timeout_id) {
            clearTimeout(note_form_timeout_id)
        }
        setNote_form_timeout_id(setTimeout(() => note_name_form.setErrors({}), 10000));
    };

    const delete_note = (note_id) => {
        const token = localStorage.getItem("token")
        axios.delete(`http://localhost:8080/api/note/${note_id}`, {
            data: {id: note_id},
            headers: {"authorization": `${token}`}
        })
            .then(() => {
                setDo_scrolling(false);
                props.setNotes(props.notes.filter(note => note._id !== note_id))
            })
            .catch(error => {
                console.log(error)
            })
    }

    const parse_date = (date) => {
        const date_obj = new Date(date)
        return `${date_obj.getHours()}:${date_obj.getMinutes().toString(10).padStart(2, '0')} ${date_obj.getDate().toString(10).padStart(2, '0')}.${(date_obj.getMonth() + 1).toString(10).padStart(2, '0')}.${date_obj.getFullYear()}`
    }

    const open_edit_note_modal = (note_id, note_name) => {
        edit_note_name_form.setValues({text: note_name, note_id: note_id})
        setEdit_modal_open(true)
    }

    const open_delete_note_modal = (note_id) => {
        setDelete_note_id(note_id)
        setDelete_modal_open(true)
    }

    const message_text = (note) => {
        return (
            <div className="d-flex flex-column">
                <div className="d-flex fw-bold">
                    <div>
                        {parse_date(note.createdAt)}
                    </div>
                    {!!note.updatedAt &&
                        <div className="ms-2 fst-italic">
                            (updated at {parse_date(note.updatedAt)} )
                        </div>
                    }
                </div>
                <div>
                    {note.text}
                </div>

            </div>
        );
    }

    return (
        <div className="mx-2 w-100 d-flex flex-column justify-content-end text-white">
            {
                delete_modal_open &&
                <ConfirmModal
                    title="Are you sure you want to delete this note?"
                    onConfirm={() => {
                        delete_note(delete_note_id)
                        setDelete_modal_open(false)
                    }}
                    onCancel={() => setDelete_modal_open(false)}
                />
            }
            {
                edit_modal_open &&
                <EditModal
                    edit_form={edit_note_name_form}
                    name="text"
                    name_label="New category name"
                    value={edit_note_name_form.values.text}
                    isInvalid={edit_note_name_form.touched.text && edit_note_name_form.errors.text}
                    onChange={edit_note_name_form.handleChange}
                    form_style="border-1"
                    modal_style="w-100 mx-4"
                    form_error={edit_note_name_form.errors.text}
                    edit_error={note_edit_name_error}
                    onCancel={() => setEdit_modal_open(false)}
                />
            }

            <ul className="list-unstyled overflow-scroll mb-1">
                {props.notes.map((note, index) => (
                    <li key={index} className="mt-1">
                        <MenuButton
                            is_highlighted_mode={false}
                            highlighted_bg="bg-light bg-opacity-10 rounded-2"
                            not_highlighted_bg=""
                            main_button_on_click={() => {
                            }}
                            main_button_text={message_text(note)}
                            edit_button_on_click={() => open_edit_note_modal(note._id, note.text)}
                            delete_button_on_click={() => open_delete_note_modal(note._id)}
                        />
                    </li>))}
                <li ref={down_message_ref}></li>
            </ul>

            <div className="m-2 mb-3">
                <NewStringForm
                    name_form={note_name_form}
                    name="text"
                    control_id="text_form"
                    name_label="Write here"
                    value={note_name_form.values.text}
                    isInvalid={note_name_form.touched.text && note_name_form.errors.text}
                    onChange={handleChange}
                    form_style="shadow-none bg-light bg-opacity-75 border-0 text-dark"
                    form_error={note_name_form.errors.text}
                    name_error={note_name_error}
                />
            </div>
        </div>);
};

export default Notes;