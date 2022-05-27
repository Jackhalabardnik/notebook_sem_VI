import NewStringForm from "../MainApp/NewNameForm/newStringForm";
import {Button} from "react-bootstrap";

const EditModal = (props) => {
    return (
        <div className="modal bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" >
            <div className={"bg-white text-center text-dark p-5 " + props.modal_style}>
                <NewStringForm
                    name_form = {props.edit_form}
                    name={props.name}
                    placeholder={props.name_label}
                    onChange={props.onChange}
                    value={ props.value }
                    isInvalid={ props.isInvalid }
                    form_error = {props.form_error}
                    name_error = {props.edit_error}
                    form_style = {props.form_style}
                    footer = {
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={props.onCancel}  className="me-2"> Cancel </Button>
                            <Button variant="primary" type="submit"> Edit </Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

export default EditModal;