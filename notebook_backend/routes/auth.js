const router = require("express").Router()
const { User, validate} = require("../models/user")
const bcrypt = require("bcrypt")
const Joi = require("joi")

const validate_login = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data)
}

// Login
router.post("/login", async (req, res) => {
  const { error } = validate_login(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Invalid email or password.")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send("Invalid email or password.")

  const token = user.generateAuthToken()
  res.send(token)
})

router.post("/signup", async (req, res) => {
    const {error} = validate(req.body)

    if (error) return res.status(400).send("validate error: " + error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if (user) return res.status(400).send("User already registered")

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    res.send(user)
})

module.exports = router