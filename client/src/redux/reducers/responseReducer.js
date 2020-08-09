import {
    ADD_RESPONSE,
    SELECT_CHOICE
} from "../actions/types"

const initialState = {
    responses: []
}

export default function(state=initialState, action) {
    switch(action.type){
        case ADD_RESPONSE:
            return {
                ...state,
                responses: [...state.responses, {quizID: action.payload.quizID, answers: []}]
            }
        case SELECT_CHOICE:
            const answerArray = state.responses.filter(res => res.id == action.payload.quizID)[0].answers
            const answerExists = answerArray.filter(ans => ans.questionID == action.payload.questionID).length != 0
            return {
                ...state,
                responses: state.responses.map(res => res.quizID == action.payload.quizID ? {...res, answers: answerExists ? res.answers.map(ans => ans.questionID == action.payload.questionID ? {...ans, answer: action.payload.choiceID} : ans) : [...res.answers, {questionID: action.payload.questionID, answer: action.payload.choiceID}]} : res)
            }
        default:
            return state
    }
}

