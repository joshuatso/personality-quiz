import React from 'react'
import {Button} from "@material-ui/core"
import {Link} from "react-router-dom"
import {useQuery} from "@apollo/client"
import {FETCH_QUIZZES} from "../graphql/queries"

export default function Home() {
    const { loading: quizzesLoading, error: quizzesError, data: quizzesData, refetch } = useQuery(FETCH_QUIZZES, {onError: reportErrors})

    function reportErrors(e) {
        console.log(e)
    }

    return (
        <div>
            <Link to="/login">
                <Button>Login</Button>
            </Link>
            {!quizzesData ? null : quizzesData.quizzes.map(quiz => <div>{quiz.title}</div>)}
        </div>
    )
}
