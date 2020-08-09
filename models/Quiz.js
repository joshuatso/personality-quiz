const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    title: {
        type: String
    },
    questions: [{
        id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        question: {
            type: String
        },
        choices: [{
            id: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            choice: { 
                type: String
            },
            weights: [{
                outcomeID: {
                    type: mongoose.Types.ObjectId,
                    required: true
                },
                weight: {
                    type: Number,
                    min: 0,
                    max: 5
                }
            }]
        }]
    }],
    outcomes: [{
        id: {
            type: String,
            required: true
        },
        outcome: {
            type: String
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