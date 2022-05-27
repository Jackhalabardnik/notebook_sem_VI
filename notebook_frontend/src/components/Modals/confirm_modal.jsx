import {Button} from "react-bootstrap";

const ConfirmModal = (props) => {
    return (
        <div className="modal bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
            <div className="bg-white text-center text-dark p-5">
                <h4>
                    {props.title}
                </h4>
                <Button variant="danger" onClick={props.onConfirm}>
                    Yes
                </Button>
                <Button variant="secondary" className="ms-2" onClick={props.onCancel}>
                    No
                </Button>
            </div>
        </div>
    );
}

export default ConfirmModal;