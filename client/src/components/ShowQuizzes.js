import React, { useState, useEffect } from 'react'
import axios from "axios"
import {uuid} from "uuidv4"

export default function ShowQuizzes() {
    const [quizzes, setQuizzes] = useState([])

    async function fetchQuizzes() {
        axios
            .get("/api/quizzes")
            .then(res => {setQuizzes(res.data.map(quiz => quiz.title))})
            .catch(e => console.log(e))
    }

    return (
        <div>
            <button onClick={() => {fetchQuizzes()}}>Show Quizzes</button>
            {quizzes.map(quiz => <div key={uuid()}>{quiz}</div>)}
        </div>
    )
}
