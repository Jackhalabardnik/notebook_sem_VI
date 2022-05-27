const router = require("express").Router()
const {Note, validate} = require("../models/note")
const auth = require("../middleware/auth")

router.use(auth)

// GET /api/notes for notebook
router.get("/:id", async (req, res) => {
    const notes = await Note.find({user: req.user._id, notebook: req.params.id}).sort({createdAt: -1})
    if (!notes) { res.status(404).send("No notes found") }
    res.send(notes)
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