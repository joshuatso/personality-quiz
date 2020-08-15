import {
    UPDATE_LOGIN_STATUS
} from "../actions/types"
import { uuid } from "uuidv4"
import axios from "axios"

const initialState = {
    loginStatus: null,
    user: null
}

export default function(state=initialState, action){
    switch (action.type){
        case UPDATE_LOGIN_STATUS:
            return {
                ...state, 
                loginStatus: action.payload.loginStatus,
                user: action.payload.user
            }
        default:
            return state
    }
}