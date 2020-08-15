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
    QUIZ_LOADING
} from "../actions/types"
import { uuid } from "uuidv4"
import axios from "axios"

const initialState = {
    id: "",
    title: "My Quiz",
    questions: [],
    outcomes: [],
    quizLoading: false
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
        case CLEAR_QUIZ:
            return initialState
        case SET_TITLE:
            return {
                ...state,
                title: action.payload.title
            }
        case ADD_OUTCOME:
            return {
                ...state,
                outcomes: [...state.outcomes, addId(action.payload.outcome)]
            }
        case REMOVE_OUTCOME:
            return {
                ...state,
                outcomes: state.outcomes.filter(outcome => outcome.id != action.payload.outcomeID)
            }
        case SET_OUTCOME_OUTCOME:
            return {
                ...state,
                outcomes: state.outcomes.map(o => o.id == action.payload.outcomeID ? {...o, outcome: action.payload.outcome} : o)
            }
        case SET_OUTCOME_DESCRIPTION:
            return {
                ...state,
                outcomes: state.outcomes.map(o => o.id == action.payload.outcomeID ? {...o, description: action.payload.description} : o)
            }
        case ADD_QUESTION:
            return {
                ...state,
                questions: [...state.questions, addId({...action.payload.question, choices: action.payload.question.choices.map(addId)})]
            }
        case REMOVE_QUESTION:
            return {
                ...state,
                questions: state.questions.filter(question => question.id != action.payload.questionID)
            }
        case SET_QUESTION_QUESTION:
            return {
                ...state,
                questions: state.questions.map(q => q.id == action.payload.questionID ? {...q, question: action.payload.questionQuestion} : q)
            }
        case ADD_CHOICE:
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: [...question.choices, addId(action.payload.choice)]} : question)
            }
        case REMOVE_CHOICE:
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: question.choices.filter(choice => choice.id != action.payload.choiceID)} : question)
            }
        case SET_CHOICE_CHOICE:
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: question.choices.map(c => c.id == action.payload.choiceID ? {...c, choice: action.payload.choiceChoice} : c)} : question)
            }
        case SET_WEIGHT:
            const weightArray = state.questions.filter(q => q.id == action.payload.questionID)[0].choices.filter(c => c.id == action.payload.choiceID)[0].weights
            const weightExists = weightArray.filter(w => w.outcomeID == action.payload.outcomeID).length != 0
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: question.choices.map(c => c.id == action.payload.choiceID ? {...c, weights: weightExists ? c.weights.map(w => w.outcomeID == action.payload.outcomeID ? {...w, weight: action.payload.weight} : w) : [...weightArray, {outcomeID: action.payload.outcomeID, weight: action.payload.weight}]} : c)} : question)
            }
        case INCREMENT_QUESTION_INDEX:
            var questionIndex = state.questions.findIndex(question => question.id == action.payload.questionID)
            if (questionIndex == state.questions.length - 1) return state
            return {
                ...state,
                questions: incrementIndex(state.questions, questionIndex)
            }
        case DECREMENT_QUESTION_INDEX:
            var questionIndex = state.questions.findIndex(question => question.id == action.payload.questionID)
            if (questionIndex == 0) return state
            return {
                ...state,
                questions: decrementIndex(state.questions, questionIndex)
            }
        case INCREMENT_CHOICE_INDEX:
            var targetQuestion = state.questions.filter(question => question.id == action.payload.questionID)[0]
            var choiceIndex = targetQuestion.choices.findIndex(choice => choice.id == action.payload.choiceID)
            if (choiceIndex == targetQuestion.choices.length - 1) return state
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: incrementIndex(question.choices, choiceIndex)} : question)
            }
        case DECREMENT_CHOICE_INDEX:
            var targetQuestion = state.questions.filter(question => question.id == action.payload.questionID)[0]
            var choiceIndex = targetQuestion.choices.findIndex(choice => choice.id == action.payload.choiceID)
            if (choiceIndex == 0) return state
            return {
                ...state,
                questions: state.questions.map(question => question.id == action.payload.questionID ? {...question, choices: decrementIndex(question.choices, choiceIndex)} : question)
            }
        case SAVE_QUIZ:
            let { id, ...stateNoId } = state
            axios
                .post("http://localhost:5000/graphql", {
                    query: `
                        mutation UpdateQuiz($id: ID!, $quiz: QuizInput) {
                            updateQuiz(id: $id, quiz: $quiz) {
                                outcomes {
                                    outcome
                                }
                            }
                        }
                    `,
                    variables: {id: id, quiz: stateNoId}
                }, {
                    headers: { Authorization: !!localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined}
                })
                .then(res => {
                    if (res.data.errors) throw Error(res.data.errors[0].message)
                })
                .catch(e => console.log(e.message))
            return state
        case CREATE_QUIZ:
            return {
                ...state,
                id: action.payload.id,
                quizLoading: false
            }
        case QUIZ_LOADING:
            return {
                ...state,
                quizLoading: true
            }
        default:
            return state
    }
}