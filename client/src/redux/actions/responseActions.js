import {
    ADD_RESPONSE,
    SELECT_CHOICE
} from "./types"

export const addResponse = quizID => {
    return {
        type: ADD_RESPONSE,
        payload: {
            quizID
        }
    }
}

export const selectChoice = (quizID, questionID, choiceID) => {
    return {
        type: SELECT_CHOICE,
        payload: {
            quizID,
            questionID,
            choiceID
        }
    }
}