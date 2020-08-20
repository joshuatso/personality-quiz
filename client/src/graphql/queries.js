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

export const FETCH_QUIZZES = gql`
    query FetchQuizzes {
        quizzes {
            id,
            title,
            questions {
                id,
                question,
                choices {
                    id,
                    choice
                }
            },
            outcomes {
                id,
                outcome,
                description
            }
        }
    }
`