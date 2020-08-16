const { gql } = require("apollo-server-express")
const typeDefs = gql`
    type Query {
        quiz(id: ID!): Quiz,
        quizzes: [Quiz]!,
        user: User,
        note(id: ID!): Note,
        notes: [Note]!
    }

    type Mutation {
        addQuiz(quiz: QuizInput): Quiz,
        updateQuiz(id: ID!, quiz: QuizInput): Quiz,
        removeQuiz(id: ID!): Boolean,
        addUser(username: String!, password: String!, email: String!): UserWithToken,
        authenticateUser(username: String!, password: String!): UserWithToken,
        addNote(note: String!): Note,
        updateNote(id: ID!, note: String!): Note
    }

    type Note {
        id: ID!,
        note: String!
    }

    scalar Date

    type UserWithToken {
        token: String!,
        user: User
    }

    type User {
        id: ID!,
        username: String!,
        email: String!,
        registerDate: Date,
        quizzes: [Quiz]
    }

    input UserInput {
        username: String!,
        password: String!,
        email: String!
    }

    type Outcome {
        id: ID!,
        outcome: String,
        description: String
    }

    input OutcomeInput {
        id: ID!,
        outcome: String,
        description: String
    }

    type Weight {
        outcomeID: ID!,
        weight: Int
    }

    input WeightInput {
        outcomeID: ID!,
        weight: Int
    }

    type Choice {
        id: ID!,
        choice: String,
        weights: [Weight]!
    }

    input ChoiceInput {
        id: ID!,
        choice: String,
        weights: [WeightInput]!
    }

    type Question {
        id: ID!,
        question: String,
        choices: [Choice]!
    }

    input QuestionInput {
        id: ID!,
        question: String,
        choices: [ChoiceInput]!
    }

    type Quiz {
        id: ID!,
        title: String,
        questions: [Question]!,
        outcomes: [Outcome]!,
        creatorID: ID!
    }

    input QuizInput {
        title: String,
        questions: [QuestionInput]!,
        outcomes: [OutcomeInput]!
    }
`

module.exports = typeDefs