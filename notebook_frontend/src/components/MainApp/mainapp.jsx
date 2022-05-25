import Category from "./Category/category";
import {useEffect, useState} from "react";
import axios from "axios";

const MainApp = () => {

    const [categories, setCategories] = useState([])
    const [notebooks, setNotebooks] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:8080/api/category`, {headers: {"authorization": `${token}`}})
            .then((response) => {
                setCategories(response.data)
            }).catch((error) => {
            console.log(error)
        })
        axios.get(`http://localhost:8080/api/notebook`, {headers: {"authorization": `${token}`}})
            .then((response) => {
                setNotebooks(response.data)
            }).catch((error) => {
            console.log(error)
        })
    }, []);

    return (
        <div className="d-flex w-100 h-100">
            <Category
                categories={categories}
                setCategories={setCategories}
                notebooks={notebooks}
                setNotebooks={setNotebooks}
                open_categories={[]}
            />
            <div className="w-100">

            </div>

        </div>);
};
export default MainApp;