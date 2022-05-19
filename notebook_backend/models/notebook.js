const mongoose = require("mongoose")
const Joi = require("joi")

const notebookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Notebook = mongoose.model("Notebook", notebookSchema)

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Notebook Name"),
    })
    return schema.validate(data)
}

module.exports = { Notebook, validate }

