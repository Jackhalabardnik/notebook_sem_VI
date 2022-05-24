import Category from "./Category/category";
import {useEffect, useState} from "react";
import axios from "axios";



const MainApp = () => {

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:8080/api/category`, {headers: {"authorization": `${token}`}})
            .then((response) => {
                setCategories(response.data)
            }).catch((error) => {
            console.log(error)
        })
    }, []);

    return (
        <div className="d-flex w-100">
            <Category />
            <div className="w-100 text-center">
                {categories.map((category, index) => (
                    // Setting "index" as key because name and age can be repeated, It will be better if you assign uniqe id as key
                    <li key={index}>
                        <span>name: {category.name}</span>{" "}
                        <span>user: {category.user}</span>
                    </li>
                ))}
            </div>

        </div>);
};
export default MainApp;