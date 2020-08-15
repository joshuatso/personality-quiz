import React, { useState, useEffect } from 'react'
import { Button } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { createQuiz } from "../redux/actions/newQuizActions"
import { Redirect, Link } from "react-router-dom"

export default function MyQuizzes({quizzes}) {
    const dispatch = useDispatch()

    return (
        <>
            {quizzes.map(quiz => <div key={`${quiz.id} intro`}>{quiz.title}</div>)}
            <Link to="/newQuiz">
                <Button onClick={() => {
                    dispatch(createQuiz())
                }}>
                    Create new quiz
                </Button>
            </Link>
        </>
    )
}
