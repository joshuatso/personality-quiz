if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const expressJWT = require("express-jwt")

// Routers
const quizRouter = require("./routes/api/quizzes")
const userRouter = require("./routes/api/users")
const graphqlHTTP = require("./graphql")

// Create express app
const app = express()

// Create Auth middleware
const auth = expressJWT({
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
})

// Use middleware
app.use(express.json())
app.use(cors())

// Connect to database
mongoose
    .connect(process.env.DATABASE_URL, 
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Mongoose..."))
    .catch(e => console.log(e))

// Use routers
app.use("/api/quizzes", quizRouter)
app.use("/api/users", userRouter)

// GraphQL
app.use("/graphql", auth, graphqlHTTP)

app.listen(process.env.PORT || 5000)