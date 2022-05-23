const router = require("express").Router()
const {User} = require("../models/user")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt");
const Joi = require("joi");

const validate_put = (data) => {
    const schema = Joi.object({
        username: Joi.string().optional().allow('').label("Username"),
        email: Joi.string().optional().email().allow('').label("Email"),
        password: Joi.string().optional().allow('').label("Password"),
        old_password: Joi.string().optional().allow('').label("Old Password"),
        r_password: Joi.string().optional().allow('').label("Repeat Password"),
    })
    return schema.validate(data)
}

router.use(auth)

// GET /users/logged_in
router.get("/logged_in", async (req, res) => {
    const user = await User.findOne({email: req.user.email})
    if (!user) return res.status(404).send("User not found")
    res.send(user)
})

// PUT /users/
router.put("/", async (req, res) => {
    const {error} = validate_put(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.user.email})
    if (!user) return res.status(404).send("User not found")

    if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({email: req.body.email})
        if (emailExists) return res.status(400).send("Email already exists")
        user.email = req.body.email
    }
    if(req.body.username && req.body.username !== user.username) {
        user.username = req.body.username
    }
    if(req.body.password) {
        if (!req.body.old_password) return res.status(400).send("Old password is required")
        const validPassword = await bcrypt.compare(req.body.old_password, user.password)
        if (!validPassword) return res.status(400).send("Invalid email or password.")
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(req.body.password, salt)
    }

    await user.save()

    res.send(user.generateAuthToken())
})

// DELETE /users/
router.delete("/", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)

    if (!user) return res.status(404).send("User not found")

    res.send(user)
})

module.exports = router