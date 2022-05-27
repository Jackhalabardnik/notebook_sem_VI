import {Button} from "react-bootstrap";
import {useState} from "react";

const MenuButton = (props) => {
    const [show_options, setShowOptions] = useState(false);

    const is_focus = () => {
        return props.is_highlighted_mode || show_options;
    }

    return (
        <div
            className={"d-flex justify-content-between p-2 text-center align-items-center " + (is_focus() ? props.highlighted_bg : props.not_highlighted_bg)}
            onPointerEnter={() => setShowOptions(true)}
            onPointerLeave={() => setShowOptions(false)}
        >
            <div
                className="bg-transparent border-0 shadow-none rounded-0 text-start w-100"
                onClick={props.main_button_on_click}>

                {props.main_button_text}

            </div>
            {
                show_options &&
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