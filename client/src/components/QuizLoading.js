import React from 'react'
import {Redirect} from "react-router-dom"
import {useSelector} from "react-redux"
import { CircularProgress } from "@material-ui/core"

export default function QuizLoading() {
    // const {id, quizLoading} = useSelector(state => state.newQuiz)
    return (
        <div>
            <div style={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <div style={{marginBottom: 30}}>Setting up your quiz...</div>
                <CircularProgress></CircularProgress>
            </div>
        </div>
    )
}
