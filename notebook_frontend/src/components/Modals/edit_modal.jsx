import NewStringForm from "../MainApp/NewNameForm/newStringForm";
import EmptyModal from "./empty_modal";
import {Button} from "react-bootstrap";

const EditModal = (props) => {

    return (
        <EmptyModal
            modal_style={props.modal_style}
            modal_title={props.modal_title}
            modal_body={
                    <NewStringForm
                        name_form={props.edit_form}
                        name={props.name}
                        name_label={props.name_label}
                        onChange={props.onChange}
                        value={props.value}
                        isInvalid={props.isInvalid}
                        form_error={props.form_error}
                        name_error={props.edit_error}
                        form_style={props.form_style}
                        footer={
                            <div className="d-flex justify-content-end mt-2">
                                <Button variant="secondary" onClick={props.onCancel} className="me-2"> Cancel </Button>
                                <Button variant="primary" type="submit"> Edit </Button>
                            </div>
                        }
                    />
            }
        />
    );
}

export default EditModal;