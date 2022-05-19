const router = require("express").Router()
const {Note, validate} = require("../models/note")
const auth = require("../middleware/auth")

router.use(auth)

// GET /api/notes for notebook with pagination
router.get("/", async (req, res) => {
    const {page = 0} = req.query
    const notes = await Note.find({user: req.user._id})
        .skip(page * 20)
        .limit(20)
    if (!notes) { res.status(404).send("No notes found") }
    res.send(notes)
})

// GET /api/notes/:id for notebook
router.get("/:id", async (req, res) => {
    const note = await Note.findOne({
        _id: req.params.id,
        user: req.user._id
    })
    if (!note) return res.status(404).send("Note not found")
    res.send(note)
})

// POST /api/notes for notebook
router.post("/", async (req, res) => {
        const {error} = validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        const note = new Note({
            text: req.body.text,
            user: req.user._id,
            notebook: req.body.notebook._id
        })
        await note.save()
        res.send(note)
    }
)

// PUT /api/notes/:id for notebook
router.put("/:id", async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const note = await Note.findOneAndUpdate({
        _id: req.body._id,
        user: req.user._id
    }, {text: req.body.text, updatedAt: Date.now }, {new: true})
    if (!note) return res.status(404).send("Note not found")
    res.send(note)
})

// DELETE /api/notes/:id for notebook
router.delete("/:id", async (req, res) => {
    const note = await Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    })
    if (!note) return res.status(404).send("Note not found")
    res.send(note)
})


module.exports = router