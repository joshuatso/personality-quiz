const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        question: {
            type: String,
            required: true
        },
        choices: [{
            id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            choice: { 
                type: String, 
                required: true 
            },
            weights: [{
                outcomeId: {
                    type: mongoose.Types.ObjectId,
                    required: true
                },
                weight: {
                    type: Number,
                    min: 0,
                    max: 5,
                    required: true
                }
            }]
        }]
    }],
    outcomes: [{
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        outcome: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    creator: {
        type: mongoose.Types.ObjectId
    }
})

module.exports = mongoose.model("Quiz", quizSchema)