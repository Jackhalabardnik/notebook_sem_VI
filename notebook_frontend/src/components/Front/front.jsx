import Login from "../Login/login";
import Signup from "../Signup/signup";

const Front = () => {
    return (
        <div>
            <nav className="bg-primary d-flex justify-content-end flex-column flex-md-row">
                <h2 className="ms-md-2 my-3 text-white text-center">
                    Notebook
                </h2>
                <div className="col-lg-5 col-xl-6 col-1">

                </div>
                <div>
                    <Login/>
                </div>
            </nav>
            <div className="d-flex flex-lg-row flex-md-column">
                <div
                    className="d-flex flex-column align-items-center fs-5 align-middle p-4 col-lg-4 col-12 text-center">

                    <ul className="text-start">
                        <li>
                            Do you need a place to store your shopping list?
                        </li>
                        <li>
                            Need a place to write down your thoughts?
                        </li>
                        <li>
                            Do you use a self-chat in discord or messenger to keep them in order?
                        </li>
                    </ul>
                    If this is true, you have come to the right place.
                    <div className="my-4">
                        <Signup/>
                    </div>

                    And create your own notebook for free!

                </div>
                <img src="/splash.png" alt="splash" className="col-lg-8 col-12 img-fluid"/>
            </div>
        </div>
    )
}
export default Front;