import React, { useState, useEffect } from 'react'
import { Button } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { createQuiz } from "../redux/actions/newQuizActions"
import { Redirect, Link } from "react-router-dom"

export default function MyQuizzes() {
    const dispatch = useDispatch()

    return (
        <>
            <div>
                My Quizzes
            </div>
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
