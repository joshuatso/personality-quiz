const { graphqlHTTP } = require("express-graphql")
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    graphqlSync,
    GraphQLBoolean
} = require("graphql")
const {
    GraphQLDate,
    GraphQLTime,
    GraphQLDateTime
} = require("graphql-iso-date")
const Quiz = require("../models/Quiz")
const User = require("../models/User")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const UserWithTokenType = new GraphQLObjectType({
    name: "UserWithToken",
    description: "Represents authenticated user with token",
    fields: () => ({
        token: { type: new GraphQLNonNull(GraphQLString) },
        user: { type: UserType }
    })
})

const UserType = new GraphQLObjectType({
    name: "User",
    description: "Represents a user",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        registerDate: { type: GraphQLDateTime }
    })
})

const UserInputType = new GraphQLInputObjectType({
    name: "UserInput",
    description: "Represents a user input",
    fields: () => ({
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const OutcomeType = new GraphQLObjectType({
    name: "Outcome",
    description: "Represents a quiz's outcome",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        outcome: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString }
    })
})

const OutcomeInputType = new GraphQLInputObjectType({
    name: "OutcomeInput",
    description: "Represents a quiz's outcome input",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        outcome: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString }
    })
})

const WeightType = new GraphQLObjectType({
    name: "Weight",
    description: "Represents a choice's weight for an outcome",
    fields: () => ({
        outcomeId: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const WeightInputType = new GraphQLInputObjectType({
    name: "WeightInput",
    description: "Represents a weight input for an outcome",
    fields: () => ({
        outcomeId: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const ChoiceType = new GraphQLObjectType({
    name: "Choice",
    description: "Represents a choice to a question",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        choice: { type: new GraphQLNonNull(GraphQLString) },
        weights: { type: new GraphQLList(WeightType) }
    })
})

const ChoiceInputType = new GraphQLInputObjectType({
    name: "ChoiceInput",
    description: "Represents a choice input to a question",
    fields: () => ({
        choice: { type: new GraphQLNonNull(GraphQLString) },
        // protected
        weights: { type: new GraphQLList(WeightInputType) }
    })
})

const QuestionType = new GraphQLObjectType({
    name: "Question",
    description: "Represents a question in a quiz",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        question: { type: new GraphQLNonNull(GraphQLString) },
        choices: { type: new GraphQLList(ChoiceType) }
    })
})

const QuestionInputType = new GraphQLInputObjectType({
    name: "QuestionInput",
    description: "Represents a question input to add a quiz",
    fields: () => ({
        question: { type: new GraphQLNonNull(GraphQLString) },
        choices: { type: new GraphQLList(ChoiceInputType) }
    })
})

const QuizType = new GraphQLObjectType({
    name: "Quiz",
    description: "represents a quiz",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        questions: { type: new GraphQLList(QuestionType) },
        outcomes: { type: new GraphQLList(OutcomeType) }
    })
})

const QuizInputType = new GraphQLInputObjectType({
    name: "QuizInput",
    description: "arguments for adding a quiz",
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        questions: { type: new GraphQLList(QuestionInputType) },
        outcomes: { type: new GraphQLList(OutcomeInputType) }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root query",
    fields: () => ({
        quiz: {
            type: QuizType,
            description: "A single quiz",
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, {id}) => await Quiz.findById(id)
        },
        quizzes: {
            type: new GraphQLList(QuizType),
            description: 'List of All Quizzes',
            resolve: async () => await Quiz.find()
        },
        authenticateUser: {
            type: UserWithTokenType,
            description: "An authenticated user",
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: async (parent, {username, password}) => {
                try {
                    const foundUser = await User.findOne({ username })
                    if (!foundUser) {
                        throw Error("Username does not exist")
                    }
                    const isMatch = await bcrypt.compare(password, foundUser.password)
                    if (!isMatch) {
                        return Error("Invalid credentials")
                    } else {
                        const token = jwt.sign(
                            {id: foundUser.id},
                            process.env.JWT_SECRET,
                            { expiresIn: 3600 }
                        )
                        return {token, user: foundUser}
                    }
                } catch (e) {
                    if (e) {
                        throw Error(e.message)
                    } else {
                        throw Error("Error adding user")
                    }
                }
            }
        },
        user: {
            type: UserType,
            description: "A single user",
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, args, context) => {
                try {
                    console.log(context)
                    if (!context.user || context.user.id != args.id) {
                        throw Error("Not authorized to retrieve this information")
                    }
                    return await User.findById(args.id)
                } catch(e) {
                    if (e) throw Error(e.message)
                    throw Error("Error retrieving user")
                }
            }
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        // protected
        addQuiz: {
            type: QuizType,
            description: "add a quiz",
            args: {
                input: { type: QuizInputType }
            },
            resolve: async (parent, {input}) => {
                try {
                    const newQuiz = new Quiz({
                        title: input.title,
                        questions: input.questions.map(question => ({
                            ...question,
                            id: new mongoose.Types.ObjectId(), 
                            choices: question.choices.map(choice => ({
                                ...choice,
                                id: new mongoose.Types.ObjectId()
                            }))
                        })),
                        outcomes: input.outcomes
                    })
                    return await newQuiz.save()
                } catch {
                    throw Error("Error saving quiz")
                }
            }
        },
        // protected
        updateQuiz: {
            type: QuizType,
            description: "update a quiz",
            args: {
                id: { type: GraphQLString },
                input: { type: QuizInputType }
            },
            resolve: async (parent, {id, input}) => {
                try {
                    const newQuizObject = { 
                        ...input, 
                        questions: input.questions.map(question => ({
                            ...question,
                            id: new mongoose.Types.ObjectId(), 
                            choices: question.choices.map(choice => ({
                                ...choice,
                                id: new mongoose.Types.ObjectId()
                            }))
                        })),
                        outcomes: input.outcomes
                    }
                    const quizExist = await Quiz.findById(id)
                    if (quizExist) {
                        return await Quiz.findOneAndReplace({_id: id}, newQuizObject)
                    } else {
                        const newQuiz = new Quiz(newQuizObject)
                        return await newQuiz.save()
                    }
                } catch {
                    throw Error("Error saving quiz")
                }
            }
        },
        // protected
        removeQuiz: {
            type: GraphQLBoolean,
            description: "remove a quiz",
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, {id}) => {
                try {
                    const quiz = await Quiz.findById(id)
                    if (!quiz) throw Error("Quiz not found")
            
                    const removed = await quiz.remove()
                    if (!removed) throw Error("Error removing quiz")
            
                    return true
                } catch (e) {
                    if (e) {
                        throw Error(e.message)
                    } else {
                        throw Error("Error removing quiz")
                    }
                }
            }
        },
        addUser: {
            type: UserWithTokenType,
            description: "Add a user",
            args: {
                input: { type: UserInputType }
            },
            resolve: async (parent, {input}) => {
                try {
                    const usernameFoundUser = await User.findOne({ username: input.username })
                    if (usernameFoundUser) {
                        throw Error("Username already exists")
                    }
                    const emailFoundUser = await User.findOne({ email: input.email })
                    if (emailFoundUser) {
                        throw Error("Email already exists")
                    }
                    const hashedPassword = await bcrypt.hash(input.password, 10)
                    const newUser = new User({
                        ...input,
                        password: hashedPassword
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign(
                        {id: savedUser.id},
                        process.env.JWT_SECRET,
                        { expiresIn: 3600 }
                    )
                    return {token, user: savedUser}
                } catch (e) {
                    if (e) {
                        throw Error(e.message)
                    } else {
                        throw Error("Error adding user")
                    }
                }
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = graphqlHTTP(req => ({
    schema: schema,
    graphiql: true,
    context: {
        user: req.user
    }
}))