const { gql } = require("apollo-server-express")
const typeDefs = gql`
    type Query {
        quiz(id: String!): Quiz,
        quizzes: [Quiz]!,
        user: User!,
        users: [User]!,
        response(id: String!): Response,
        responses: [Response]!
    }

    type Mutation {
        addQuiz(quiz: QuizInput!): Quiz,
        updateQuiz(id: String!, quiz: QuizInput!): Quiz,
        removeQuiz(id: String!): Boolean,
        addUser(username: String!, password: String!, email: String!): UserWithToken,
        authenticateUser(username: String!, password: String!): UserWithToken,
        addResponse(quizID: String!, choices: [ResponseChoiceInput]!): Response
    }

    scalar Date

    type UserWithToken {
        token: String!,
        user: User
    }

    type User {
        id: String!,
        username: String!,
        email: String,
        registerDate: Date,
        quizzes: [Quiz],
        responses: [Response]
    }

    input UserInput {
        username: String!,
        password: String!,
        email: String!
    }

    type ResponseChoice {
        questionID: String!,
        choiceID: String!
    }

    input ResponseChoiceInput {
        questionID: String!,
        choiceID: String!
    }

    type Response {
        id: String!,
        quiz: Quiz,
        choices: [ResponseChoice],
        outcome: Outcome,
        dateResponded: Date,
        responder: User
    }

    type Outcome {
        id: String!,
        outcome: String,
        description: String
    }

    input OutcomeInput {
        id: String!,
        outcome: String,
        description: String
    }

    type Weight {
        outcome: Outcome,
        weight: Int
    }

    input WeightInput {
        outcomeID: String!,
        weight: Int
    }

    type Choice {
        id: String!,
        choice: String,
        weights: [Weight]!
    }

    input ChoiceInput {
        id: String!,
        choice: String,
        weights: [WeightInput]!
    }

    type Question {
        id: String!,
        question: String,
        choices: [Choice]!
    }

    input QuestionInput {
        id: String!,
        question: String,
        choices: [ChoiceInput]!
    }

    type Quiz {
        id: String!,
        title: String,
        questions: [Question]!,
        outcomes: [Outcome]!,
        creator: User,
        responses: [Response]
    }

    input QuizInput {
        title: String,
        questions: [QuestionInput]!,
        outcomes: [OutcomeInput]!
    }
`

module.exports = typeDefs