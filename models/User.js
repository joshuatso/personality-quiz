const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    quizIDs: [{
        type: mongoose.Types.ObjectId, 
        ref: "Quiz",
        default: []
    }],
    responseIDs: [{
        type: mongoose.Types.ObjectId,
        ref: "Response",
        default: []
    }]
})

module.exports = mongoose.model("User", userSchema)