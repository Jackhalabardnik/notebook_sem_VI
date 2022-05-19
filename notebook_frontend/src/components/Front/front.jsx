import { Link } from "react-router-dom";
import Login from "../Login/login";

const Front = () => {
    return (
        <div>
            <nav className="bg-primary d-flex justify-content-end">
                <h2 className="my-auto ms-5 text-white">
                    Notebook
                </h2>
                <div className="w-75">

                </div>
                <div>
                    <Login/>
                </div>
            </nav>
            <div>
                Yo bro
                <div>
                    <Link to="/signup">Signup</Link>
                </div>
            </div>
        </div>
    )
}
export default Front;