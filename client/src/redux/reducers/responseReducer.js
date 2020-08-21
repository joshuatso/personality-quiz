import {
    CREATE_RESPONSE,
    SELECT_CHOICE
} from "../actions/types"

const initialState = {
    quizID: "",
    answers: []
}

export default function(state=initialState, action) {
    switch(action.type){
        case CREATE_RESPONSE:
            return {
                ...state,
                quizID: action.payload.quizID,
                choices: []
            }
        case SELECT_CHOICE:
            const answerExists = state.answers.find(ans => ans.questionID == action.payload.questionID)
            return {
                ...state,
                answers: answerExists ? state.answers.map(ans => ans.questionID == action.payload.questionID ? {...ans, choiceID: action.payload.choiceID} : ans) : [...state.answers, {questionID: action.payload.questionID, choiceID: action.payload.choiceID}]
            }
        default:
            return state
    }
}

