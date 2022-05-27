import {Alert, Form} from "react-bootstrap";

const NewStringForm = (props) => {
    return(
        <div>
            <Form onSubmit={props.name_form.handleSubmit} noValidate>
                    <Form.Control
                        type="text"
                        name={props.name}
                        placeholder={props.name_label}
                        onChange={props.onChange}
                        value={ props.value }
                        isInvalid={ props.isInvalid }
                        className={props.form_style}
                    />
                    <Form.Control.Feedback type="invalid"
                                           className="fw-bold">{props.form_error }</Form.Control.Feedback>
                    {
                        props.footer && props.footer
                    }
            </Form>
            {props.name_error &&
                <Alert variant="danger" className="text-center m-2">Error: {props.name_error}</Alert>}
        </div>
    );
}

export default NewStringForm;