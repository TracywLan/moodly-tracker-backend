const express = require("express");
const Mood = require('../models/mood');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

// GET /hoots/:hootId
router.get('/:moodId', async (req, res) => {
    try {
       const mood = await Mood.findById(req.params.moodId).populate('author');
       res.status(200).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})

// PUT /hoots/:hootId
router.put('/:moodId', verifyToken, (req, res) => {
    try {
        const mood = 
    }
})

router.delete('/:moodId', async (req, res) => {
    try {
    await Mood.findByIdAndDelete(req, params.moodId);
    res.redirect('/moods');
} catch (err) {
    res.redirect('/moods')
}
});







module.exports = router