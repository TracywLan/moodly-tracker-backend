const express = require("express");
const Mood = require('../models/mood');
const router = express.Router();

router.get('/', async (req, res)=> {
    try {
        const moods = await Mood.find({})
        .populate("author")
        .populate("comments.author")
        .populate("createdAt: -1");

        res.json(moods)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;