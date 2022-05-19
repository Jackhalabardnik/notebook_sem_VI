const router = require("express").Router()
const {Notebook, validate} = require("../models/notebook")
const auth = require("../middleware/auth")

router.use(auth)

// GET /api/notebooks for a user
router.get("/", async (req, res) => {
    const notebooks = await Notebook.find({user: req.user._id})
    if (!notebooks) return res.status(404).send("No notebooks found")
    res.send(notebooks)
})

// get all notebooks for a user in given category
router.get('/api/category', auth, async (req, res) => {
    const user = req.user
    const category = req.query.category
    const notebooks = await Notebook.find({user: user._id, category: category})
    if (!notebooks) return res.status(404).send("No notebooks found")
    res.send(notebooks)
});

// GET /api/notebooks/:id for a user
router.get("/:id", async (req, res) => {
    const notebook = await Notebook.findById(req.params.id)
    if (!notebook) return res.status(404).send("Notebook not found")
    res.send(notebook)
})

// POST /api/notebooks for a user and a category and check if notebook exists
router.post("/", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = req.user
    const category = req.body.category
    const name = req.body.name
    const notebook = await Notebook.findOne({user: user._id, category: category, name: name})
    if (notebook) return res.status(400).send("Notebook already exists")

    const newNotebook = new Notebook({
        user: user._id,
        category: category._id,
        name: name
    })
    await newNotebook.save()
    res.send(newNotebook)
})

// PUT /api/notebooks/:id for a user
router.put("/:id", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const notebook = await Notebook.findOneAndUpdate({
        _id: req.body._id,
        user: req.user._id
    }, {name: req.body.name}, {new: true})
    if (!notebook) return res.status(404).send("Notebook not found")
    res.send(notebook)
})

// DELETE /api/notebooks/:id for a user
router.delete("/:id", async (req, res) => {
    const notebook = await Notebook.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    })
    if (!notebook) return res.status(404).send("Notebook not found")
    res.send(notebook)
})

module.exports = router
