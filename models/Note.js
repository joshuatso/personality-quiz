const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    note: {type: String}
})

module.exports = mongoose.model("Note", noteSchema)