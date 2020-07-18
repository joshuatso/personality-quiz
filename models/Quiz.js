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
        choices: [{type: String}]
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