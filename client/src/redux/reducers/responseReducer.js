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
                responses: [...state.responses, {quizId: action.payload.quizId, answers: []}]
            }
        case SELECT_CHOICE:
            const answerArray = state.responses.filter(res => res.id == action.payload.quizId)[0].answers
            const answerExists = answerArray.filter(ans => ans.questionId == action.payload.questionId).length != 0
            return {
                ...state,
                responses: state.responses.map(res => res.quizId == action.payload.quizId ? {...res, answers: answerExists ? res.answers.map(ans => ans.questionId == action.payload.questionId ? {...ans, answer: action.payload.choiceId} : ans) : [...res.answers, {questionId: action.payload.questionId, answer: action.payload.choiceId}]} : res)
            }
        default:
            return state
    }
}

