import React, { useState, useEffect } from 'react'
import { Button } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { createQuiz, fetchQuiz } from "../redux/actions/newQuizActions"
import { Redirect, Link } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { DELETE_QUIZ } from "../graphql/mutations"

export default function MyQuizzes({quizzes, refetchQuizzes}) {
    const dispatch = useDispatch()
    const [deleteQuiz, {}] = useMutation(DELETE_QUIZ, {onError: reportErrors})

    function reportErrors(e) {
        console.log(e)
    }

    return (
        <>
            {quizzes.map(quiz => 
                <div key={`${quiz.id} intro`}>
                    {quiz.title}
                    <Link to="/newQuiz">
                        <Button onClick={() => dispatch(fetchQuiz(quiz.id))}>
                            Edit
                        </Button>
                    </Link>
                    <Button onClick={() => {
                        deleteQuiz({variables: {id: quiz.id}}).then(() => refetchQuizzes())
                    }}>
                        Delete
                    </Button>
                </div>
            )}
            <Link to="/newQuiz">
                <Button onClick={() => dispatch(createQuiz())}>
                    Create new quiz
                </Button>
            </Link>
        </>
    )
}
