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

        // --- DEBUG SECTION (Now placed BEFORE the check) ---
        console.log('--- DEBUGGING AUTH ---');
        console.log('1. Mood Author ID:', mood.author);
        console.log('2. User ID (req.user):', req.user);
        
        // SAFEGUARDS: Handle missing IDs gracefully to see what's wrong
        const authorIdString = mood.author ? mood.author.toString() : 'MISSING_AUTHOR';
        const userIdString = req.user && req.user._id ? req.user._id.toString() : 'MISSING_USER_ID';
        
        console.log(`3. Comparing: "${authorIdString}" vs "${userIdString}"`);

        if(!req.user || !mood.author.equals(req.user._id)) {
            return res.status(403).send('Unauthorized');
        }

        await mood.deleteOne();

        res.status(200).json({ message: 'Mood deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});



// POST /moods/:moodId/comments

// PUT /moods/:moodId/comments/:commentId

// DELETE /moods/:moodId/comments/:commentId

module.exports = router