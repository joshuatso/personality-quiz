import {gql} from "@apollo/client"

export const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
        authenticateUser(username: $username, password: $password) {
            token,
            user {
                id,
                username,
                email,
                registerDate
            }
        }
    }
`

export const REGISTER_USER = gql`
    mutation RegisterUser($username: String!, $password: String!, $email: String!) {
        addUser(username: $username, password: $password, email: $email) {
            token,
            user {
                id,
                username,
                email,
                registerDate
            }
        }
    }
`

export const DELETE_QUIZ = gql`
    mutation DeleteQuiz($id: String!) {
        removeQuiz(id: $id)
    }
`
export const ADD_RESPONSE = gql`
    mutation AddResponse($response: ResponseInput!) {
        addResponse(response: $response) {
            outcome {
                outcome,
                description
            }
        }
    }
`