const Mood = require("../models/hoot");
const router = require("express").Router();



router.delete('/:moodId', async (req, res) => {
    await Mood.findByIdAndDelete(req, URLSearchParams.moodId)
}







module.exports = router