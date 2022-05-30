import {Alert, FloatingLabel, Form} from "react-bootstrap";

const NewStringForm = (props) => {

    return (
        <div className={props.div_style}>
            <Form onSubmit={props.name_form.handleSubmit} noValidate>
                <FloatingLabel controlId="inputPassword" label={props.name_label} className="text-white">
                    <Form.Control
                        type="text"
                        name={props.name}
                        placeholder={props.name_label}
                        onChange={props.onChange}
                        value={props.value}
                        isInvalid={props.isInvalid}
                        className={" " + props.form_style}
                    />
                    <Form.Control.Feedback type="invalid"
                                           className="fw-bold w-100">{props.form_error}</Form.Control.Feedback>
                </FloatingLabel>
                {
                    props.footer && props.footer
                }
            </Form>
            {props.name_error &&
                <Alert variant="danger" className="text-center m-2 ">Error: {props.name_error}</Alert>}
        </div>
    );
}

export default NewStringForm;