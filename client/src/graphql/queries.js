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

export const FETCH_QUIZ_TITLES = gql`
    query FetchQuizzes {
        quizzes {
            id,
            title
        }
    }
`

export const FETCH_QUIZ_FOR_RESPONSE = gql`
    query FetchQuizForResponse($id: String!) {
        quiz(id: $id) {
            id,
            title,
            questions {
                id,
                question,
                choices {
                    id,
                    choice
                }
            }
        }
    }
`