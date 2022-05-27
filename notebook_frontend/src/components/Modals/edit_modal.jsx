import {Alert, Button, FloatingLabel, Form} from "react-bootstrap";

const EditModal = (props) => {
    return (
        <div className="modal-backdrop fade show d-flex justify-content-center align-items-center">
            <div className="bg-white text-center text-dark p-5">
                <Form onSubmit={props.edit_category_name_form.handleSubmit} noValidate>
                    <FloatingLabel controlId="edit_category_name" label="Edit category" className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={props.edit_category_name_form.handleChange}
                            value={props.edit_category_name_form.values.name}
                            isInvalid={props.edit_category_name_form.touched.name && !!props.edit_category_name_form.errors.name}
                        />
                        <Form.Control.Feedback type="invalid"
                                               className="fw-bold">{props.edit_category_name_form.errors.name}</Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="d-flex">
                        <Button variant="primary" type="submit" > Edit </Button>
                        <Button variant="secondary" onClick={props.onCancel}> Cancel </Button>
                    </div>
                </Form>
                {props.form_error &&
                    <Alert variant="danger" className="text-center m-2">Error: {props.form_error}</Alert>}
            </div>
        </div>
    );
}

export default EditModal;