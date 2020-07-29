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
            }
        }]
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