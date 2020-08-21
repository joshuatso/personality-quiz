const mongoose = require("mongoose")

const responseSchema = new mongoose.Schema({
    quizID: {
        type: mongoose.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    quizCreatorID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [{
        questionID: {
            type: String,
            required: true
        },
        choiceID: {
            type: String,
            require: true
        }
    }],
    outcome: {
        id: {
            type: String
        },
        outcome: {
            type: String
        },
        description: {
            type: String
        }
    },
    dateResponded: {
        type: Date,
        default: Date.now()
    },
    responderID: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Response", responseSchema)