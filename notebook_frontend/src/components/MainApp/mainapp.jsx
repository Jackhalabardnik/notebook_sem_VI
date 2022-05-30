import Category from "./Category/category";
import {useEffect, useState} from "react";
import axios from "axios";
import Notes from "./Notes/notes";

const MainApp = () => {

    const [categories, setCategories] = useState([])
    const [notebooks, setNotebooks] = useState([])
    const [notes, setNotes] = useState([])
    const [active_notebook, setActiveNotebook] = useState(null)


    useEffect(() => {
        const token = localStorage.getItem("token")
        axios.get(`http://localhost:8080/api/category`, {headers: {"authorization": `${token}`}})
            .then((response_category) => {
                setCategories(response_category.data)
                axios.get(`http://localhost:8080/api/notebook`, {headers: {"authorization": `${token}`}})
                    .then((response_notebook) => {
                        setNotebooks(response_notebook.data)
                        const last_notebook_id = localStorage.getItem("last_notebook_id")
                        let last_notebook = response_notebook.data.find(notebook => notebook.id === last_notebook_id)
                        last_notebook = last_notebook ? last_notebook : response_notebook.data[1]
                        setActiveNotebook(last_notebook)
                    }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
            console.log(error)
        })




    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(active_notebook) {
            axios.get(`http://localhost:8080/api/note/${active_notebook._id}`, {headers: {"authorization": `${token}`}})
                .then((response) => {
                    setNotes(response.data)
                }).catch((error) => {
                console.log(error)
            })
        }
    }, [active_notebook]);

    return (

        <div className="vh-100 overflow-hidden d-flex">

        <Category
            categories={categories}
            setCategories={setCategories}
            notebooks={notebooks}
            setNotebooks={setNotebooks}
            open_categories={[-1]}
            active_notebook={active_notebook}
            setActiveNotebook={setActiveNotebook}
            notes={notes}
            setNotes={setNotes}
        />

        <Notes
            active_notebook={active_notebook}
            notes={notes}
            setNotes={setNotes}
        />

        </div>);
};
export default MainApp;