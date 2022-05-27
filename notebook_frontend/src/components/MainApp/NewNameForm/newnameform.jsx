import {Alert, FloatingLabel, Form} from "react-bootstrap";

const NewNameForm = (props) => {
    return(
        <div>
            <Form onSubmit={props.name_form.handleSubmit} noValidate>
                <FloatingLabel controlId={props.control_id} label={props.name_label} className="mb-3">
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={props.onChange}
                        value={props.name_form.values.name}
                        isInvalid={props.name_form.touched.name && !!props.name_form.errors.name}
                    />
                    <Form.Control.Feedback type="invalid"
                                           className="fw-bold">{props.name_form.errors.name}</Form.Control.Feedback>
                </FloatingLabel>
            </Form>
            {props.name_error &&
                <Alert variant="danger" className="text-center m-2">Error: {props.name_error}</Alert>}
        </div>
    );
}

export default NewNameForm;