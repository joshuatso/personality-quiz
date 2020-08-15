import {gql} from "@apollo/client"

export const FETCH_USER = gql`
    query FetchUser {
        user {
            id,
            username,
            email,
            registerDate,
            quizzes {
                id,
                title
            }
        }
    }
`