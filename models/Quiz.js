const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    title: {
        type: String
    },
    questions: [{
        id: {
            type: String,
            required: true
        },
        question: {
            type: String
        },
        choices: [{
            id: {
                type: String,
                required: true
            },
            choice: { 
                type: String
            },
            weights: [{
                outcomeID: {
                    type: String,
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
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    responseIDs: [{
        type: mongoose.Types.ObjectId,
        ref: "Response",
        default: []
    }]
})

module.exports = mongoose.model("Quiz", quizSchema)