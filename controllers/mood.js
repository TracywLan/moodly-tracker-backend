const Mood = require("../models/mood");
const router = require("express").Router();
const verifyToken = require("../middleware/verify-token")

// CREATE - POST /moods
router.post('/', verifyToken, async (req,res) => {
    try {
        const moodData = {
            ...req.body,
            author:req.user._id,
        }
        const newMood = await Mood.create(moodData)

        res.status(201).json(newMood);
    } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message }) 
    }
})

//SHOW
router.get("/:id", async (req,res) => {
    try {
        const mood = await Mood.findById(req.params.id)
        .populate("author")
        .populate("comments.author")
        if(!mood){
            return res.status(404).json({ error: "Mood not found "})
        }
        res.json(mood);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
})


router.delete('/:moodId', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.moodId);
    res.redirect('/moods');
  } catch (err) {
    console.log(err);
    res.redirect('/moods');
  }
});








module.exports = router