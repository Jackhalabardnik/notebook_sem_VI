import Category from "./Category/category";
import {useEffect, useState} from "react";
import axios from "axios";

const MainApp = () => {

    const [categories, setCategories] = useState([])
    const [notebooks, setNotebooks] = useState([])
    const [notes, setNotes] = useState([])
    const [active_notebook, setActiveNotebook] = useState(null)


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
                const last_notebook_id = localStorage.getItem("last_notebook_id")
                let last_notebook = response.data.find(notebook => notebook.id === last_notebook_id)
                last_notebook = last_notebook ? last_notebook : response.data[0]
                setActiveNotebook(last_notebook)
            }).catch((error) => {
            console.log(error)
        })
        axios.get(`http://localhost:8080/api/note`, {headers: {"authorization": `${token}`}})
            .then((response) => {
                setNotes(response.data)
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
                active_notebook={active_notebook}
                setActiveNotebook={setActiveNotebook}
            />
            <div className="w-100">
            </div>

        </div>);
};
export default MainApp;