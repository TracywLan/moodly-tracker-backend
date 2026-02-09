const { text } = require("express");
const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    text: {
        type:String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true }
)
const moodSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    moodLabel: {
        type: String,
        enum: [
            'very-sad',
            'sad',
            'neutral',
            'happy',
            'very happy',
            'anxious',
            'angry',
            'excited',
            'tired',
            'calm',
        ],
        default: 'neutral',
    },
    
    // what influenced/related with the mood
    activities: [
        {
            type: String,
            enum: [
                'work',
                'school',
                'friends',
                'family',
                'hobby',
                "social event",
                'food',
                'health',
                'other',
            ]
        }
    ],
    
    note: {
        type: String,
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [commentSchema],
},
    { timestamps: true }
)

const Mood = mongoose.model('Mood', moodSchema);
module.exports = Mood;