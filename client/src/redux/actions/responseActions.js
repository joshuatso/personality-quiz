import {
    ADD_RESPONSE,
    SELECT_CHOICE
} from "./types"

export const addResponse = quizId => {
    return {
        type: ADD_RESPONSE,
        payload: {
            quizId
        }
    }
}

export const selectChoice = (quizId, questionId, choiceId) => {
    return {
        type: SELECT_CHOICE,
        payload: {
            quizId,
            questionId,
            choiceId
        }
    }
}