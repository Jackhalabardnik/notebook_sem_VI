import Rnavbar from "../RNavBar/rnavbar";
import MainApp from "../MainApp/mainapp";

const Main = () => {

    return (
        <div className="vh-100 overflow-hidden d-flex flex-column justify-content-between">
            <Rnavbar/>
            <MainApp/>
        </div>
    )
}
export default Main