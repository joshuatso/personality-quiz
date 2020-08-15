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