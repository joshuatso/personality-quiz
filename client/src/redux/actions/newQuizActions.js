import {
    CLEAR_QUIZ,
    SET_TITLE,
    ADD_OUTCOME,
    REMOVE_OUTCOME,
    SET_OUTCOME_OUTCOME,
    SET_OUTCOME_DESCRIPTION,
    ADD_QUESTION,
    REMOVE_QUESTION,
    SET_QUESTION_QUESTION,
    ADD_CHOICE,
    REMOVE_CHOICE,
    SET_CHOICE_CHOICE,
    SET_WEIGHT,
    INCREMENT_QUESTION_INDEX,
    DECREMENT_QUESTION_INDEX,
    INCREMENT_CHOICE_INDEX,
    DECREMENT_CHOICE_INDEX,
    SAVE_QUIZ,
    CREATE_QUIZ,
    FETCH_QUIZ,
    QUIZ_LOADING
} from "./types"
import axios from "axios"

export const clearQuiz = () => {
    return {
        type: CLEAR_QUIZ
    }
}

export const setTitle = title => dispatch => {
    dispatch({
        type: SET_TITLE,
        payload: {
            title
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const addOutcome = outcome => dispatch => {
    dispatch ({
        type: ADD_OUTCOME,
        payload: {
            outcome
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const removeOutcome = outcomeID => dispatch => {
    dispatch({
        type: REMOVE_OUTCOME,
        payload: {
            outcomeID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const setOutcomeOutcome = (outcomeID, outcome) => dispatch => {
    dispatch({
        type: SET_OUTCOME_OUTCOME,
        payload: {
            outcomeID,
            outcome
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const setOutcomeDescription = (outcomeID, description) => dispatch => {
    dispatch({
        type: SET_OUTCOME_DESCRIPTION,
        payload: {
            outcomeID,
            description
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const addQuestion = question => dispatch => {
    dispatch({
        type: ADD_QUESTION,
        payload: {
            question
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const removeQuestion = questionID => dispatch => {
    dispatch({
        type: REMOVE_QUESTION,
        payload: {
            questionID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const setQuestionQuestion = (questionID, questionQuestion) => dispatch => {
    dispatch({
        type: SET_QUESTION_QUESTION,
        payload: {
            questionID,
            questionQuestion
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const addChoice = (questionID, choice) => dispatch => {
    dispatch({
        type: ADD_CHOICE,
        payload: {
            questionID,
            choice
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const removeChoice = (questionID, choiceID) => dispatch => {
    dispatch({
        type: REMOVE_CHOICE,
        payload: {
            questionID,
            choiceID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const setChoiceChoice = (questionID, choiceID, choiceChoice) => dispatch => {
    dispatch({
        type: SET_CHOICE_CHOICE,
        payload: {
            questionID,
            choiceID,
            choiceChoice
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const setWeight = (questionID, choiceID, outcomeID, weight) => dispatch => {
    dispatch({
        type: SET_WEIGHT,
        payload: {
            questionID,
            choiceID,
            outcomeID,
            weight
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const incrementQuestionIndex = questionID => dispatch => {
    dispatch({
        type: INCREMENT_QUESTION_INDEX,
        payload: {
            questionID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const decrementQuestionIndex = questionID => dispatch => {
    dispatch({
        type: DECREMENT_QUESTION_INDEX,
        payload: {
            questionID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const incrementChoiceIndex = (questionID, choiceID) => dispatch => {
    dispatch({
        type: INCREMENT_CHOICE_INDEX,
        payload: {
            questionID,
            choiceID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const decrementChoiceIndex = (questionID, choiceID) => dispatch => {
    dispatch({
        type: DECREMENT_CHOICE_INDEX,
        payload: {
            questionID,
            choiceID
        }
    })
    dispatch({
        type: SAVE_QUIZ
    })
}

export const saveQuiz = () => {
    return {
        type: SAVE_QUIZ
    }
}

export const createQuiz = () => dispatch => {
    dispatch({
        type: QUIZ_LOADING
    })
    dispatch({
        type: CLEAR_QUIZ
    })
    axios
        .post("http://localhost:5000/graphql", {
            query: `
                mutation CreateQuiz($quiz: QuizInput!) {
                    addQuiz(quiz: $quiz) {
                        id
                    }
                }
            `,
            variables: {
                quiz: {
                    title: "My Quiz",
                    questions: [],
                    outcomes: []
                }
            }
        }, {
            headers: { Authorization: !!localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined}
        })
        .then(res => {
            if (res.data.errors) throw Error(res.data.errors[0].message)
            dispatch({
                type: CREATE_QUIZ,
                payload: {
                    id: res.data.data.addQuiz.id
                }
            })
        })
        .catch (e => {
            if (e) console.log(e.message)
            else console.log("Error creating quiz")
        })
}

export const fetchQuiz = (id) => dispatch => {
    dispatch({
        type: QUIZ_LOADING
    })
    dispatch({
        type: CLEAR_QUIZ
    })
    axios
        .post("http://localhost:5000/graphql", {
            query: `
                query FetchQuiz($id: String!) {
                    quiz(id: $id) {
                        id,
                        title,
                        questions {
                            id,
                            question,
                            choices {
                                id,
                                choice,
                                weights {
                                    outcome {
                                        id
                                    },
                                    weight
                                }
                            }
                        },
                        outcomes {
                            id,
                            outcome,
                            description
                        }
                    }
                }
            `,
            variables: {id}
        }, {
            headers: { Authorization: !!localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined}
        })
        .then(res => {
            if (res.data.errors) throw Error(res.data.errors[0].message)
            dispatch({
                type: FETCH_QUIZ,
                payload: {
                    ...res.data.data.quiz,
                    questions: res.data.data.quiz.questions.map(question => ({...question, choices: question.choices.map(choice => ({...choice, weights: choice.weights.map(weight => ({...weight, outcomeID: weight.outcome.id, outcome: null}))}))}))
                }
            })
        })
        .catch (e => {
            if (e) console.log(e.message)
            else console.log("Error fetching quiz")
        })
}