import EmptyModal from "./empty_modal";
import {Alert, Button, FloatingLabel, Form} from "react-bootstrap";
import {useFormik} from "formik";
import axios from "axios";
import * as yup from "yup";
import {useState} from "react";
import MenuButton from "../MainApp/MenuButton/menubutton";

const search_validation_schema = yup.object().shape({
    text: yup.string().required().min(1).max(2000).label('Text'), range: yup.string().label('Range'),
});

const SearchModal = (props) => {

    const [search_name_error, setSearchNameError] = useState(false);
    const [found_notes, setFoundNotes] = useState([]);
    const [is_many_notebooks, setIsManyNotebooks] = useState(false);
    const [is_search_empty, setIsSearchEmpty] = useState(false);

    const search_name_form = useFormik({
        initialValues: {
            text: '', range: 'notebook',
        }, validationSchema: search_validation_schema, onSubmit: values => {
            console.log("Search Name Form Values: ", values);
            const token = localStorage.getItem("token");

            let address = `http://localhost:8080/api/note/search/${search_name_form.values.text}`;

            if (search_name_form.values.range === 'notebook') {
                address += `/${props.active_notebook._id}`;
                setIsManyNotebooks(false);
            } else {
                setIsManyNotebooks(true);
            }
            axios.get(address, {headers: {"authorization": `${token}`}})
                .then(response => {
                    setFoundNotes(response.data);
                    if(response.data.length === 0) {
                        setIsSearchEmpty(true);
                    } else {
                        setIsSearchEmpty(false);
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                        setSearchNameError(error.response.data)
                    }
                })
        },
    });

    const get_notebook_and_category = (note) => {
        let notebook = props.notebooks.find(notebook => notebook._id === note.notebook);
        let category = props.categories.find(category => category._id === note.category);
        return (<div className="d-flex">
            <div className="fw-bold me-1">{category.name}</div>
            <div>{notebook.name}</div>
        </div>);
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        search_name_form.setFieldValue(name, value);
    };

    return (<EmptyModal
        modal_style={props.modal_style + (found_notes.length > 0 ? " h-75" : "")}
        modal_title={props.modal_title}
        modal_body={<div className="d-flex flex-column h-100 p-3">
            <div>
                <Form onSubmit={search_name_form.handleSubmit} noValidate>
                    <FloatingLabel controlId="inputPassword" label="Search note" className="text-white">
                        <Form.Control
                            type="text"
                            name="text"
                            placeholder="Search note"
                            onChange={handleChange}
                            value={search_name_form.values.text}
                            isInvalid={search_name_form.touched.text && search_name_form.errors.text}
                            className="shadow-none bg-light bg-opacity-25 border-0 text-white"
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold w-100">{search_name_form.errors.text}</Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="d-flex justify-content-end mt-1">
                        <Form.Check
                            type="radio"
                            name="range"
                            id="notebook"
                            label="This notebook"
                            checked={search_name_form.values.range === "notebook"}
                            className="shadow-none text-white me-2"
                            onChange={() => {
                                search_name_form.setFieldValue("range", "notebook")
                            }}
                        />
                        <Form.Check
                            type="radio"
                            name="range"
                            id="everywhere"
                            label="Everywhere"
                            className="shadow-none text-white"
                            checked={search_name_form.values.range === "everywhere"}
                            onChange={() => {
                                search_name_form.setFieldValue("range", "everywhere")
                            }}
                        />
                    </div>

                    {<div className="d-flex justify-content-end mt-2">
                        <Button variant="secondary" onClick={props.onCancel}
                                className="me-2"> Cancel </Button>
                        <Button variant="primary" type="submit" className="shadow-none"> Search </Button>
                    </div>}
                </Form>
                {search_name_error &&
                    <Alert variant="danger" className="text-center m-2 ">Error: {search_name_error}</Alert>}
            </div>
            {found_notes.length > 0 &&
                <ul className="list-unstyled overflow-scroll my-1 text-white bg-light bg-opacity-10 rounded-2">
                    {found_notes.map((note, index) => (<li key={index} className="">
                        <MenuButton
                            is_highlighted_mode={false}
                            highlighted_bg="bg-light bg-opacity-10 rounded-2"
                            not_highlighted_bg=""
                            main_button_on_click={() => {
                            }}
                            main_button_text={<div>
                                {is_many_notebooks && get_notebook_and_category(note)}
                                {props.message_text(note)}
                            </div>}
                            edit_button_on_click={() => {
                            }}
                            delete_button_on_click={() => {
                            }}
                            no_buttons={true}
                        />
                    </li>))}
                </ul>
            }
            {
                is_search_empty &&
                <Alert variant="danger" className="text-center mt-2 ">No notes found</Alert>
            }
        </div>}
    />);
}

export default SearchModal;