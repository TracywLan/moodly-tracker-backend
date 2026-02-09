const express = require("express");
const Mood = require('../models/mood');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');


//INDEX /moods
router.get("/",verifyToken,async (req,res)=> {
    try {
        const moods = await Mood.find()
        .populate("author")
        .populate("comments.author")

        res.json(moods)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})
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



// GET /moods/:moodId show
router.get('/:moodId', async (req, res) => {
    try {
       const mood = await Mood.findById(req.params.moodId).populate('author');
       res.status(200).json(mood);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})

// PUT /moods/:moodId update
router.put('/:moodId', verifyToken, async(req, res) => {
    try {
        const mood = await Mood.findById(req.params.moodId);

        if(!mood.author.equals(req.user._id)) {
            return res.status(403).send('You are not allowed to do that')
        }

        const updatedMood = await Mood.findByIdAndUpdate(
            req.params.moodId,
            req.body,
            { new:true }
        );
        updatedMood._doc.author = req.author;

        res.status(200).json(updatedMood)
    } catch (err) {
         res.status(500).json({ err: err.message });
    }
})


// DELETE /mood/:moodId
router.delete('/:moodId', async (req, res) => {
    try {
    await Mood.findByIdAndDelete(req.params.moodId);
    res.redirect('/moods');
} catch (err) {
    res.redirect('/moods')
}
});



// POST /moods/:moodId/comments
router.post("/:moodId/comments", verifyToken, async (req,res) => {
    try {
        const { text } = req.body;
        
        if(!text || text.trim() === "") {
            return res.status(400).json({ error: "Comment text is required"})
        } 

        const mood = await Mood.findById(req.params.moodId);

        if(!mood) {
            return res.status(404).json({ error: "Mood not found" })
        }

        mood.comments.push({
            text,
            author: req.user._id
        })

        await mood.save();

        const populatedMood = await Mood.findById(mood._id)
        .populate("author")
        .populate("comments.author");

        res.status(201).json(populatedMood)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })        
    }
})
// PUT /moods/:moodId/comments/:commentId

// DELETE /moods/:moodId/comments/:commentId

module.exports = router