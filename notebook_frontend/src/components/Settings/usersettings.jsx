import Rnavbar from "../RNavBar/rnavbar";
import UserEdit from "../UserEdit/useredit";

const UserSettings = () => {

    return (
        <div>
            <Rnavbar/>
            <div className="d-flex justify-content-center bg-dark h-100">
                <UserEdit/>
            </div>
        </div>
    )
}
export default UserSettings