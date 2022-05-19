const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({_id: this._id, username: this.username, email: this.email}, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    })
}
const User = mongoose.model("User", userSchema)

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
    })
    return schema.validate(data)
}
module.exports = { User, validate }