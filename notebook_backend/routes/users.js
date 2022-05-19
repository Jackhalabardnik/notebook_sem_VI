const router = require("express").Router()
const {User, validate} = require("../models/user")
const auth = require("../middleware/auth")

router.use(auth)

// GET /users/logged_in
router.get("/logged_in", async (req, res) => {
    const user = await User.findOne({email: req.user.email})
    if (!user) return res.status(404).send("User not found")
    res.send(user)
})

// PUT /users/:id
router.put("/:id", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findByIdAndUpdate(req.params.id, {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }, {new: true})

    if (!user) return res.status(404).send("User not found")

    res.send(user)
})

// DELETE /users/:id
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)

    if (!user) return res.status(404).send("User not found")

    res.send(user)
})

module.exports = router