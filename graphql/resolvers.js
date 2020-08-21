const Quiz = require("../models/Quiz")
const User = require("../models/User")
const Response = require("../models/Response")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const fetchingBeyondDenormalizedFields = (info, selections, denormalizedFields) => {
    if (!info && !selections) return false
    if (info) {
        selections = info.fieldNodes.find(field => field.name.value == info.fieldName).selectionSet.selections
    }
    return selections.filter(field => !denormalizedFields.includes(field.name.value)).length > 0
}

module.exports = {
    Query: {
        quiz: async (_, { id }) => {
            try {
                const quiz = await Quiz.findById(id)
                if (!quiz) throw Error("Quiz not found for that ID")
                return quiz
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error finding quiz")
            }
        },
        quizzes: async () => {
            try {
                return await Quiz.find()
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error finding quizzes")
            }
        },
        user: async (_, __, context) => {
            try {
                if (!context.user) {
                    throw Error("No user identifier received")
                }
                const user = await User.findById(context.user.id)
                if (!user) throw Error("User not found with that ID")
                return user
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error retrieving user")
            }
        },
        users: async (_, __, context) => {
            try {
                return await User.find()
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error retrieving users")
            }
        },
        response: async (_, {id}, context) => {
            try {
                const response = await Response.findById(id)
                if (!response) throw Error("No response found for that ID")
                return response
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error retrieving response")
            }
        },
        responses: async (_, __, context) => {
            try {
                return await Response.find()
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error retrieving responses")
            }
        }
    },
    Mutation: {
        addQuiz: async (_, { quiz }, context) => {
            try {
                if (!context.user) {
                    throw Error("Not authorized to create a quiz")
                }
                const newQuiz = new Quiz({...quiz, creatorID: context.user.id})
                const savedNewQuiz = await newQuiz.save()
                const user = await User.findById(context.user.id)
                user.quizIDs.push(savedNewQuiz.id)
                user.save()
                return savedNewQuiz
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error creating quiz")
            }
        },
        updateQuiz: async (_, { id, quiz }, context) => {
            try {
                const foundQuiz = await Quiz.findById(id)
                if (foundQuiz) {
                    if (context.user.id != foundQuiz.creatorID) {
                        throw Error("Not authorized to update this quiz")
                    }
                    foundQuiz.title = quiz.title
                    foundQuiz.questions = quiz.questions
                    foundQuiz.outcomes = quiz.outcomes
                    return await foundQuiz.save()
                } else throw Error("Quiz not found")
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error saving quiz")
            }
        },
        removeQuiz: async (_, { id }, context) => {
            try {
                const foundQuiz = await Quiz.findById(id)
                if (foundQuiz) {
                    if (context.user.id != foundQuiz.creatorID) {
                        throw Error("Not authorized to remove this quiz")
                    }
                    const user = await User.findById(foundQuiz.creatorID)
                    user.quizIDs = user.quizIDs.filter(quiz => quiz.id != id)
                    user.save()
                    const removedQuiz = await foundQuiz.remove()
                    if (removedQuiz) {
                        return true
                    } else {
                        throw Error("Error removing quiz")
                    }
                } else throw Error("Quiz not found")
            } catch (e) {
                if (e) throw Error(e.message)
                throw Error("Error removing quiz")
            }
        },
        addUser: async (_, { username, email, password }) => {
            try {
                const usernameFoundUser = await User.findOne({ username })
                if (usernameFoundUser) {
                    throw Error("Username already exists")
                }
                const emailFoundUser = await User.findOne({ email })
                if (emailFoundUser) {
                    throw Error("Email already exists")
                }
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = new User({
                    username,
                    email,
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
                if (e) throw Error(e.message)
                throw Error("Error adding user")
            }
        },
        authenticateUser: async (_, { username, password }) => {
            try {
                const foundUser = await User.findOne({ username })
                if (!foundUser) {
                    throw Error("Username does not exist")
                }
                const isMatch = await bcrypt.compare(password, foundUser.password)
                if (!isMatch) {
                    throw Error("Password is incorrect")
                } else {
                    const token = jwt.sign(
                        {id: foundUser.id},
                        process.env.JWT_SECRET,
                        { expiresIn: 3600 }
                    )
                    return {token, user: foundUser}
                }
            } catch (e) {
                if (e) throw Error(e.message) 
                throw Error("Error authenticating user")
            }
        },
        addResponse: async (_, {quizID, choices}, context) => {
            try {
                if (!context.user) {
                    throw Error("Not authorized to create a response")
                }
                const quiz = Quiz.findById(quizID)
                if (!quiz) throw Error("No quiz found for that ID")
                let outcomeTotals = {}
                quiz.outcomes.forEach(outcome => {
                    outcomeTotals[outcome.id] = {...outcome, score: 0}
                })
                let questionObject = {}
                quiz.questions.forEach(question => {
                    let choiceObject = {}
                    question.choices.forEach(choice => {
                        choiceObject[choice.id] = choice.weights
                    })
                    questionObject[question.id] = choiceObject
                })
                choices.forEach(choice => {
                    let weights = questionObject[choice.questionID][choice.choiceID]
                    weights.forEach(weight => {
                        outcomeTotals[weight.outcomeID].score += weight.weight
                    })
                })
                const outcomeTotalsArray = Object.values(outcomeTotals)
                const winningOutcome = outcomeTotalsArray.reduce((highOutcome, curOutcome) => curOutcome.score >= highOutcome.score ? curOutcome : highOutcome)
                delete winningOutcome.score
                const newResponse = new Response({quizID, quizCreatorID: quiz.creatorID, choices, outcome: winningOutcome, responderID: context.user.id})
                const savedNewResponse = await newResponse.save()
                const user = await User.findById(context.user.id)
                user.responseIDs.push(savedNewResponse.id)
                user.save()
                quiz.responseIDs.push(savedNewResponse.id)
                return savedNewResponse
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error creating response")
            }
        }
    },
    User: {
        email: (parent, __, context) => {
            if (!context.user || context.user.id != parent.id) return null
            else return parent.email
        },
        responses: async (parent, __, context, info) => {
            if (!context.user || context.user.id != parent.id) return null
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("responseIDs").execPopulate()).responseIDs
            } else {
                return parent.responseIDs.map(id => ({id}))
            }
        },
        quizzes: async (parent, __, context, info) => {
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("quizIDs").execPopulate()).quizIDs
            } else {
                return parent.quizIDs.map(id => ({id}))
            }
        }
    },
    Response: {
        quiz: async (parent, __, context, info) => {
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("quizID").execPopulate()).quizID
            } else {
                return {id: parent.quizID}
            }
        },
        responder: async (parent, __, context, info) => {
            if (!context.user) return null
            if (context.user.id != parent.responderID && context.user.id != parent.quizCreatorID) return null
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("responderID").execPopulate()).responderID
            } else {
                return {id: parent.responderID}
            }
        }
    },
    Quiz: {
        creator: async (parent, __, context, info) => {
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("creatorID").execPopulate()).creatorID
            } else {
                return {id: parent.creatorID}
            }
        },
        responses: async (parent, __, context, info) => {
            if (fetchingBeyondDenormalizedFields(info, null, ["id"])) {
                return (await parent.populate("responseIDs").execPopulate()).responseIDs
            } else {
                return parent.responseIDs.map(id => ({id}))
            }
        },
        questions: async (parent, __, context, info) => {
            if (!context.user || context.user.id != parent.creatorID) {
                return parent.questions.map(question => ({...question, choices: question.choices.map(choice => ({...choice, weights: null}))}))
            } else {
                const questionsSelections = info.fieldNodes.find(field => field.name.value == info.fieldName).selectionSet.selections
                const outcomeSelections = questionsSelections.find(field => field.name.value == "choices").selectionSet.selections.find(field => field.name.value == "weights").selectionSet.selections.find(field => field.name.value == "outcome").selectionSet.selections
                if (fetchingBeyondDenormalizedFields(null, outcomeSelections, ["id"])) {
                    let outcomesObject = {}
                    parent.outcomes.forEach(outcome => {
                        outcomesObject[outcome.id] = outcome
                    })
                    return parent.questions.map(question => ({...question, choices: question.choices.map(choice => ({...choice, weights: choice.weights.map(weight => ({...weight, outcome: outcomesObject[weight.outcomeID]}))}))}))
                } else {
                    return parent.questions.map(question => ({...question, choices: question.choices.map(choice => ({...choice, weights: choice.weights.map(weight => ({...weight, outcome: {id: weight.outcomeID}}))}))}))
                }
            }
        }
    }
}