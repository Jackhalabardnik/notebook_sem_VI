require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const connection = require('./db')
const userRoutes = require("./routes/users")
const authRoutes = require("./routes/auth")
const categoryRoutes = require("./routes/categories")
const notebookRoutes = require("./routes/notebooks")
const noteRoutes = require("./routes/notes")

connection()

if(process.env.IS_DEV === 'true') {
    const drop_data_without_users_and_seed_them = require('./misc/seed_user_data');
    drop_data_without_users_and_seed_them().then()
}

app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/notebook", notebookRoutes)
app.use("/api/note", noteRoutes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Nasłuchiwanie na porcie ${port}`))