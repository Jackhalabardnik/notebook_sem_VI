const mongoose = require("mongoose")
const Joi = require("joi")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})

const Category = mongoose.model("Category", categorySchema)

const validate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("Category Name"),
    })
    return schema.validate(data)
}
module.exports = { Category, validate }





