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
    quizzes: [{
        type: mongoose.Types.ObjectId, 
        ref: "Quiz"
    }]
})

module.exports = mongoose.model("User", userSchema)