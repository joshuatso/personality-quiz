import React from 'react'
import {Redirect} from "react-router-dom"
import {useSelector} from "react-redux"
import QuizLoading from "./QuizLoading"

export default function NewQuiz() {
    const {id, quizLoading} = useSelector(state => state.newQuiz)
    return (
        <>
            {quizLoading ? <QuizLoading></QuizLoading> : <Redirect to={`editQuiz/${id}`}></Redirect>}
        </>
    )
}
