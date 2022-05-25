const router = require("express").Router()
const {Category, validate} = require("../models/category")
const auth = require("../middleware/auth")
const {Notebook} = require("../models/notebook");
const {Note} = require("../models/note");

router.use(auth)

// GET /api/categories
router.get("/", async (req, res) => {
    const categories = await Category.find({user: req.user._id}).sort("name")
    if (!categories) return res.status(404).send("Categories not found")
    res.send(categories)
})

// GET /api/categories/:id
router.get("/:id", async (req, res) => {
    const category = await Category.findOne({_id: req.params.id, user: req.user._id})
    if (!category) return res.status(404).send("The category with the given ID was not found.")
    res.send(category)
})

// POST /api/categories
router.post("/", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const same_category = await Category.findOne({name: req.body.name, user: req.user._id})
    if (same_category) return res.status(400).send("Category already exists")

    let category = new Category({
        name: req.body.name,
        user: req.user._id
    })
    category = await category.save()
    res.send(category)
})

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const category = await Category.findOneAndUpdate({
        _id: req.body._id,
        user: req.user._id
    }, {name: req.body.name}, {new: true})
    if (!category) return res.status(404).send("The category with the given ID was not found.")
    res.send(category)
})

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
    const category = await Category.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    })
    if (!category) return res.status(404).send("The category with the given ID was not found.")

    await Notebook.deleteMany({category: category._id})
    await Note.deleteMany({category: category._id})

    res.send(category)
})

module.exports = router