const mongoose = require("mongoose")
const Joi = require("joi")

const noteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 2000
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

const Note = mongoose.model("Note", noteSchema, "Note")

const validate = (data) => {
    const schema = Joi.object({
        text: Joi.string().required().min(1).max(2000).label("Note text"),
        category_id: Joi.string().optional().label("Category Id"),
        notebook_id: Joi.string().optional().label("Notebook Id"),
    })
    return schema.validate(data)
}
module.exports = { Note, validate }





