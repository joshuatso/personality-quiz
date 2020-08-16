const Quiz = require("../models/Quiz")
const User = require("../models/User")
const Note = require("../models/Note")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
                const quizzes = await Quiz.find()
                return quizzes
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error finding quizzes")
            }
        },
        user: async (_, __, context) => {
            try {
                if (!context.user) {
                    throw Error("Not authorized to retrieve this information")
                }
                return await User.findById(context.user.id).populate("quizzes")
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Error retrieving user")
            }
        },
        note: async (_, { id }) => {
            try {
                return await Note.findById(id)
            } catch(e) {
                if (e) throw Error(e.message)
                throw Error("Note not found")
            }
        },
        notes: async () => {
            return await Note.find()
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
                user.quizzes.push(savedNewQuiz.id)
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
                    user.quizzes = user.quizzes.filter(quiz => quiz.id != id)
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
                    return Error("Password is incorrect")
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
        addNote: async (_, {note}) => {
            const newNote = new Note({note})
            return await newNote.save()
        },
        updateNote: async (_, {id, note}) => {
            const foundNote = await Note.findById(id)
            foundNote.note = note
            return await foundNote.save()
        }
    }
}