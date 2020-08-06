import { combineReducers } from "redux"
import newQuizReducer from "./newQuizReducer"
import responseReducer from './responseReducer'

export default combineReducers({
    newQuiz: newQuizReducer,
    response: responseReducer
})