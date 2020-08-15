import { combineReducers } from "redux"
import newQuizReducer from "./newQuizReducer"
import responseReducer from './responseReducer'
import authReducer from "./authReducer"

export default combineReducers({
    newQuiz: newQuizReducer,
    response: responseReducer,
    auth: authReducer
})