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
const Quiz = require("../../models/Quiz")
const mongoose = require("mongoose")

const ChoiceType = new GraphQLObjectType({
    name: "Choice",
    description: "Represents a choice to a question",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        choice: { type: new GraphQLNonNull(GraphQLString) }
    })
})

const ChoiceInputType = new GraphQLInputObjectType({
    name: "ChoiceInput",
    description: "Represents a choice input to a question",
    fields: () => ({
        choice: { type: new GraphQLNonNull(GraphQLString) }
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
        questions: { type: new GraphQLList(QuestionType) }
    })
})

const QuizInputType = new GraphQLInputObjectType({
    name: "QuizInput",
    description: "arguments for adding a quiz",
    fields: () => ({
        title: { type: new GraphQLNonNull(GraphQLString) },
        questions: { type: new GraphQLList(QuestionInputType) }
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
            resolve: async (parent, args) => await Quiz.findById(args.id)
        },
        quizzes: {
            type: new GraphQLList(QuizType),
            description: 'List of All Quizzes',
            resolve: async () => await Quiz.find()
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root mutation",
    fields: () => ({
        addQuiz: {
            type: QuizType,
            description: "add a quiz",
            args: {
                input: { type: QuizInputType }
            },
            resolve: async (parent, args) => {
                try {
                    const newQuiz = new Quiz({
                        title: args.input.title,
                        questions: args.input.questions.map(question => ({
                            ...question,
                            id: new mongoose.Types.ObjectId(), 
                            choices: question.choices.map(choice => ({
                                ...choice,
                                id: new mongoose.Types.ObjectId()
                            }))
                        }))
                    })
                    return await newQuiz.save()
                } catch {
                    throw Error("Error saving quiz")
                }
            }
        },
        updateQuiz: {
            type: QuizType,
            description: "update a quiz",
            args: {
                id: { type: GraphQLString },
                input: { type: QuizInputType }
            },
            resolve: async (parent, args) => {
                try {
                    return await Quiz.findOneAndReplace({_id: args.id}, { 
                        ...args.input, 
                        questions: args.input.questions.map(question => ({
                            ...question,
                            id: new mongoose.Types.ObjectId(), 
                            choices: question.choices.map(choice => ({
                                ...choice,
                                id: new mongoose.Types.ObjectId()
                            }))
                        }))})
                } catch {
                    throw Error("Error saving quiz")
                }
            }
        },
        removeQuiz: {
            type: GraphQLBoolean,
            description: "remove a quiz",
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                try {
                    const quiz = await Quiz.findById(args.id)
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
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

module.exports = graphqlHTTP({
    schema: schema,
    graphiql: true
})