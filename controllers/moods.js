const express = require("express");
const Mood = require('../models/mood');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

// GET /hoots/:hootId show
router.get('/:moodId', async (req, res) => {
    try {
       const mood = await Mood.findById(req.params.moodId).populate('author');
       res.status(200).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})

// PUT /hoots/:hootId update
router.put('/:moodId', verifyToken, async(req, res) => {
    try {
        const mood = await Mood.findById(req.params.moodId);

        if(!hoot.author.equals(req.user._id)) {
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


// DELETE /hoots/:hootId
router.delete('/:moodId', async (req, res) => {
    try {
    await Mood.findByIdAndDelete(req, params.moodId);
    res.redirect('/moods');
} catch (err) {
    res.redirect('/moods')
}
});







module.exports = router