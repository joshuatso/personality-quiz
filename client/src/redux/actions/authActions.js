import {
    UPDATE_LOGIN_STATUS
} from "./types"
import axios from "axios"

export const updateLoginStatus = () => dispatch => {
    if (!localStorage.getItem("token")) dispatch({
        type: UPDATE_LOGIN_STATUS, 
        payload: {
            loginStatus: false,
            user: null
        }
    })
    axios
        .post("http://localhost:5000/graphql", {
            query: `
                query {
                    user {
                        id,
                        username,
                        email,
                        registerDate
                    }
                }
            `,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => dispatch({
            type: UPDATE_LOGIN_STATUS,
            payload: {
                loginStatus: true,
                user: res.data.user
            }
        }))
        .catch(() => dispatch({
            type: UPDATE_LOGIN_STATUS, 
            payload: {
                loginStatus: false,
                user: null
            }
        }))
}