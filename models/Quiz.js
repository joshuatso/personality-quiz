const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String
        },
        choices: [{
            choice: {
                type: String
            }
        }]
    }],
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Quiz", quizSchema)