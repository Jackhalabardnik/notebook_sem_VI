const EmptyModal = (props) => {
    return (
        <div className="modal bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
            <div className={"bg-dark rounded-1 " + props.modal_style}>
                <div className="bg-secondary bg-opacity-25 text-center text-dark p-5 d-flex flex-column justify-content-between ">
                    <div className="text-center fs-4 text-white mb-3">
                        {props.modal_title}
                    </div>
                    <div>
                        {props.modal_body}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmptyModal;