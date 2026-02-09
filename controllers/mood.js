const express = require("express");
const Mood = require('../models/mood');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');


//INDEX /moods
router.get('/', verifyToken, async (req, res)=> {
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
router.post('/', verifyToken, async (req, res) => {
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
router.delete('/:moodId', verifyToken, async (req, res) => {
    try {

        const mood = await Mood.findById(req.params.moodId);

        if(!mood) {
            return res.status(404).json({ err:'Mood not found' })
        }

        if(!req.user || !mood.author.equals(req.user._id)) {
            return res.status(403).json({ message:'You are not authorized!' });
        }

        await mood.deleteOne();

        res.status(200).json({ message: 'Mood deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
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
router.put('/:moodId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.moodId);

        if(!mood) {
            return res.status(404).json({ err: 'Mood not found' });
        }

        const comment = mood.comments.id(req.params.commentId);

        if(!comment) {
            return res.status(404).json({ err: 'Comment not found' });
        }
        
        if (comment.author.toString() !== req.user._id)
            return res.status(403).json({ message:'You are not authorized to edit this comment!' });
        
        comment.text = req.body.text;
        await mood.save();
        
        res.status(200).json({ message: 'Comment updated successfully' })
    } catch (err) {
    res.status(500).json({ err: err.message });
  }
})

// DELETE /moods/:moodId/comments/:commentId

router.delete('/:moodId/comments/:commentId', verifyToken, async (req, res) => {
    try {

        const mood = await Mood.findById(req.params.moodId);

        if(!mood) {
            return res.status(404).json({ err: 'Mood not found' });
        }

        const comment = mood.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ err: 'Comment not found' });
        }

        if(comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message:'You are not authorized to edit this comment' });
        }

        mood.comments.pull(req.params.commentId);
        await mood.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})

module.exports = router