import {Button} from "react-bootstrap";
import {useState} from "react";

const MenuButton = (props) => {
    const [show_options, setShowOptions] = useState(false);
    const [highlight_edit, setHighlightEdit] = useState(false);
    const [highlight_delete, setHighlightDelete] = useState(false);

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
                className="bg-transparent text-start w-100"
                onClick={props.main_button_on_click}>

                {props.main_button_text}

            </div>
            {
                show_options &&
                <div className="d-flex">
                    <Button className={"shadow-none px-1 py-0 border-0 " + (highlight_edit ? "bg-info" : "bg-transparent")}
                            type="button"
                            data-toggle="tooltip"
                            data-placement="top" title="Edit"
                            onClick={props.edit_button_on_click}
                            onPointerEnter={() => setHighlightEdit(true)}
                            onPointerLeave={() => setHighlightEdit(false)}
                    >
                        <img src="/pencil-square.svg" alt="Trash icon"
                             style={{filter: "invert(100%)"}}  ></img>
                    </Button>
                    <Button className={"shadow-none p-1 py-0 border-0 " + (highlight_delete ? "bg-danger" : "bg-transparent")}
                            type="button"
                            data-toggle="tooltip"
                            data-placement="top" title="Delete"
                            onClick={props.delete_button_on_click}
                            onPointerEnter={() => setHighlightDelete(true)}
                            onPointerLeave={() => setHighlightDelete(false)}
                    >
                        <img src="/trash3.svg" alt="Trash icon"  style={{filter: "invert(100%)"}}></img>
                    </Button>
                </div>
            }

        </div>
    );
}


export default MenuButton;