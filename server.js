if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")

// Routers
const quizRouter = require("./routes/api/quizzes")
const userRouter = require("./routes/api/users")

// Create express app
const app = express()

// Middleware
app.use(express.json())

// Connect to database
mongoose
    .connect(process.env.DATABASE_URL, 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Mongoose..."))
    .catch(e => console.log(e))

// Use routers
app.use("/api/quizzes", quizRouter)
app.use("/api/users", userRouter)

app.listen(process.env.PORT || 5000)