import {
    CREATE_RESPONSE,
    SELECT_CHOICE
} from "./types"

export const createResponse = quizID => {
    return {
        type: CREATE_RESPONSE,
        payload: {
            quizID
        }
    }
}

export const selectChoice = (questionID, choiceID) => {
    return {
        type: SELECT_CHOICE,
        payload: {
            questionID,
            choiceID
        }
    }
}