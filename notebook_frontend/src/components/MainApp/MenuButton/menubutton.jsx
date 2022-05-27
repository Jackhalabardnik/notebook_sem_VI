import {Button} from "react-bootstrap";

const MenuButton = (props) => {

    return (
        <div
            className={"d-flex justify-content-between bg-dark " + (props.is_highlighted_mode ?
                props.highlighted_bg : props.not_highlighted_bg)}>
            <Button
                className={"bg-transparent border-0 shadow-none rounded-0 text-start w-100 " + (props.is_highlighted_mode ? "text-white" : "text-dark")}
                onClick={props.main_button_on_click}>

                {props.main_button_text}

            </Button>
            {
                props.is_highlighted_mode &&
                <div className="d-flex">
                    <Button variant="secondary" className="shadow-none rounded-0" type="button"
                            data-toggle="tooltip"
                            data-placement="top" title="Edit" onClick={props.edit_button_on_click}>
                        <img src="/pencil-square.svg" alt="Trash icon"
                             style={{filter: "invert(100%)"}}></img>
                    </Button>
                    <Button variant="danger" className="shadow-none rounded-0" type="button"
                            data-toggle="tooltip"
                            data-placement="top" title="Delete"
                            onClick={props.delete_button_on_click}>
                        <img src="/trash3.svg" alt="Trash icon" style={{filter: "invert(100%)"}}></img>
                    </Button>
                </div>
            }

        </div>
    );
}


export default MenuButton;