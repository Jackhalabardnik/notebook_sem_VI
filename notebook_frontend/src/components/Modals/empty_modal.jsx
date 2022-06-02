const EmptyModal = (props) => {
    return (
        <div className="modal bg-dark bg-opacity-50 d-flex justify-content-center align-items-center vh-100 overflow-hidden">
                <div className={"bg-dark p-5 d-flex flex-column " + props.modal_style}>
                    <div className="text-center fs-4 text-white mb-3">
                        {props.modal_title}
                    </div>
                    {props.modal_body}
                </div>
        </div>
    );
}

export default EmptyModal;