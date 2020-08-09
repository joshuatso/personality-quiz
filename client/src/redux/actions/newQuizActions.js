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
    CREATE_QUIZ
} from "./types"
import axios from "axios"

export const clearQuiz = () => {
    return {
        type: CLEAR_QUIZ
    }
}

export const setTitle = title => {
    return {
        type: SET_TITLE,
        payload: {
            title
        }
    }
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

export const removeOutcome = outcomeID => {
    return {
        type: REMOVE_OUTCOME,
        payload: {
            outcomeID
        }
    }
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

export const setOutcomeDescription = (outcomeID, description) => {
    return {
        type: SET_OUTCOME_DESCRIPTION,
        payload: {
            outcomeID,
            description
        }
    }
}

export const addQuestion = question => {
    return {
        type: ADD_QUESTION,
        payload: {
            question
        }
    }
}

export const removeQuestion = questionID => {
    return {
        type: REMOVE_QUESTION,
        payload: {
            questionID
        }
    }
}

export const setQuestionQuestion = (questionID, questionQuestion) => {
    return {
        type: SET_QUESTION_QUESTION,
        payload: {
            questionID,
            questionQuestion
        }
    }
}

export const addChoice = (questionID, choice) => {
    return {
        type: ADD_CHOICE,
        payload: {
            questionID,
            choice
        }
    }
}

export const removeChoice = (questionID, choiceID) => {
    return {
        type: REMOVE_CHOICE,
        payload: {
            questionID,
            choiceID
        }
    }
}

export const setChoiceChoice = (questionID, choiceID, choiceChoice) => {
    return {
        type: SET_CHOICE_CHOICE,
        payload: {
            questionID,
            choiceID,
            choiceChoice
        }
    }
}

export const setWeight = (questionID, choiceID, outcomeID, weight) => {
    return {
        type: SET_WEIGHT,
        payload: {
            questionID,
            choiceID,
            outcomeID,
            weight
        }
    }
}

export const incrementQuestionIndex = questionID => {
    return {
        type: INCREMENT_QUESTION_INDEX,
        payload: {
            questionID
        }
    }
}

export const decrementQuestionIndex = questionID => {
    return {
        type: DECREMENT_QUESTION_INDEX,
        payload: {
            questionID
        }
    }
}

export const incrementChoiceIndex = (questionID, choiceID) => {
    return {
        type: INCREMENT_CHOICE_INDEX,
        payload: {
            questionID,
            choiceID
        }
    }
}

export const decrementChoiceIndex = (questionID, choiceID) => {
    return {
        type: DECREMENT_CHOICE_INDEX,
        payload: {
            questionID,
            choiceID
        }
    }
}

export const saveQuiz = () => {
    return {
        type: SAVE_QUIZ
    }
}

export const createQuiz = () => dispatch => {
    axios
        .post("http://localhost:5000/graphql", {
            query: `
                mutation CreateQuiz($quiz: QuizInput) {
                    addQuiz(quiz: $quiz) {
                        id
                    }
                }
            `,
            variables: {quiz: {
                title: "My Quiz",
                questions: [],
                outcomes: []
            }}
        })
        .then(res => dispatch({
            type: CREATE_QUIZ,
            payload: {
                id: res.data.data.addQuiz.id
            }
        }))
        .catch (() => {
            console.log("Error creating quiz")
        })
}