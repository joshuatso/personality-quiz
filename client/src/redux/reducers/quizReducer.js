import {
    SET_TITLE,
    ADD_QUESTION,
    REMOVE_QUESTION,
    ADD_CHOICE,
    REMOVE_CHOICE,
    INCREMENT_QUESTION_INDEX,
    DECREMENT_QUESTION_INDEX,
    INCREMENT_CHOICE_INDEX,
    DECREMENT_CHOICE_INDEX
} from "../actions/types"
import { uuid } from "uuidv4"

const initialState = {
    title: "",
    questions: []
}

function addId(obj) {
    return {...obj, id: uuid()}
}

function incrementIndex(list, index){
    return [...list.slice(0, index), list[index+1], list[index], ...list.slice(index+2)]
}

function decrementIndex(list, index){
    return [...list.slice(0, index-1), list[index], list[index-1], ...list.slice(index+1)]
}

export default function(state=initialState, action){
    switch (action.type){
        case SET_TITLE:
            return {
                ...state,
                title: action.payload.title
            }
        case ADD_QUESTION:
            return {
                ...state,
                questions: [...state.questions, addId({...action.payload.question, choices: action.payload.question.choices.map(addId)})]
            }
        case REMOVE_QUESTION:
            return {
                ...state,
                questions: state.questions.filter(question => question.id != action.payload.questionId)
            }
        case ADD_CHOICE:
            return {
                ...state,
                questions: state.questions.map(question => questions.id == action.payload.questionId ? {...question, choices: [...question.choices, addId(action.payload.choice)]} : question)
            }
        case REMOVE_CHOICE:
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionId ? {...question, choices: question.choices.filter(choice => choice.id != action.payload.choiceId)} : question)
            }
        case INCREMENT_QUESTION_INDEX:
            var questionIndex = state.questions.findIndex(question => question.id == action.payload.questionId)
            if (questionIndex == state.questions.length - 1) return state
            return {
                ...state,
                questions: incrementIndex(state.questions, questionIndex)
            }
        case DECREMENT_QUESTION_INDEX:
            var questionIndex = state.questions.findIndex(question => question.id == action.payload.questionId)
            if (questionIndex == 0) return state
            return {
                ...state,
                questions: decrementIndex(state.questions, questionIndex)
            }
        case INCREMENT_CHOICE_INDEX:
            var targetQuestion = state.questions.filter(question => question.id == action.payload.questionId)[0]
            var choiceIndex = targetQuestion.choices.findIndex(choice => choice.id == action.payload.choiceId)
            if (choiceIndex == targetQuestion.choices.length - 1) return state
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionId ? {...question, choices: incrementIndex(question.choices, choiceIndex)} : question)
            }
        case DECREMENT_CHOICE_INDEX:
            var targetQuestion = state.questions.filter(question => question.id == action.payload.questionId)[0]
            var choiceIndex = targetQuestion.choices.findIndex(choice => choice.id == action.payload.choiceId)
            if (choiceIndex == 0) return state
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionId ? {...question, choices: decrementIndex(question.choices, choiceIndex)} : question)
            }
        default:
            return state
    }
}