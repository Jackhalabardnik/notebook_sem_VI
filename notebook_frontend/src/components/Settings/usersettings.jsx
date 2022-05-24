import Rnavbar from "../RNavBar/rnavbar";
import UserEdit from "../UserEdit/useredit";

const UserSettings = () => {

    return (
        <div>
            <Rnavbar/>
            <div className="d-flex justify-content-center my-3">
                <UserEdit/>
            </div>
        </div>
    )
}
export default UserSettings