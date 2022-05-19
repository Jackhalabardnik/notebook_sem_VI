const mongoose = require("mongoose")
const Joi = require("joi")

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    notebook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notebook",
        required: true
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

const Note = mongoose.model("Note", noteSchema)

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Note text"),
    })
    return schema.validate(data)
}
module.exports = { Note, validate }





