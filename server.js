if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const expressJWT = require("express-jwt")
const { ApolloServer } = require("apollo-server-express")

// Routers
const quizRouter = require("./routes/api/quizzes")
const userRouter = require("./routes/api/users")

// GraphQL
const typeDefs = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")

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
app.use(auth)

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
const apolloServer = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({user: req.user}) })
apolloServer.applyMiddleware({ app, path: "/graphql" })

app.listen(process.env.PORT || 5000, () =>
console.log(`🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`))