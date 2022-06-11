import {Button} from "react-bootstrap";
import EmptyModal from "./empty_modal";

const ConfirmModal = (props) => {
    return (
        <EmptyModal
            modal_style={props.modal_style}
            modal_title={props.modal_title}
            modal_body={
                <div className="d-flex justify-content-center">
                    <Button variant="danger" onClick={props.onConfirm}>
                        Yes
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={props.onCancel}>
                        No
                    </Button>
                </div>
            }
        />
    );
}

export default ConfirmModal;