const express = require("express")
const router = express.Router()
const Quiz = require("../../models/Quiz")

// @route   GET api/quizzes
// @desc    Get All Quizzes
// @access  Public

router.get("/", (req, res) => {
    Quiz.find()
        .then(quizzes => res.status(200).json(quizzes))
        .catch(() => res.status(400).json({ msg: "Error querying database" }))
})

// @route   GET api/quizzes/id
// @desc    Get a quiz
// @access  Public

router.get("/:id", (req, res) => {
    Quiz.findById(req.params.id)
        .then(quiz => res.status(200).json(quiz))
        .catch(() => res.status(400).json({ msg: "Quiz not found" }))
})

// @route   POST api/quizzes
// @desc    Create a quiz
// @access  Public

router.post("/", (req, res) => {
    const newQuiz = new Quiz({
        title: req.body.title,
        questions: req.body.questions
    })

    newQuiz.save()
        .then(quiz => res.status(200).json(quiz))
        .catch(() => res.status(400).json({ msg: "Error saving quiz" }))
})

// @route   PUT api/quizzes/id
// @desc    Update a quiz
// @access  Public

router.put("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findOneAndReplace({_id: req.params.id}, {
            title: req.body.title,
            questions: req.body.questions
        })
        res.status(200).json(quiz)
    } catch (e) {
        res.status(400).json({ msg: e.message })
    }
})

// @route   DELETE api/quizzes/id
// @desc    Delete a quiz
// @access  Public

router.delete("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
        if (!quiz) throw Error("Quiz not found")

        const removed = await quiz.remove()
        if (!removed) throw Error("Something went wrong with deleting the quiz")

        res.status(200).json({ success: true })
    } catch (e) {
        res.status(400).json({ msg: e.message, success: false })
    }
})


module.exports = router