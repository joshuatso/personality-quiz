import React, { useState, useEffect } from 'react'
import axios from "axios"
import {uuid} from "uuidv4"
import { gql, useQuery } from "@apollo/client"

export default function ShowQuizzes() {
    const [quizzes, setQuizzes] = useState([])
    const { loading, error, data } = useQuery(gql`
        {
            quizzes {
                title
            }
        }
    `)

    function fetchQuizzes() {
        setQuizzes(data.quizzes.map(quiz => quiz.title))
    }

    return (
        <div>
            <button onClick={() => {fetchQuizzes()}}>Show Quizzes</button>
            {quizzes.map(quiz => <div key={uuid()}>{quiz}</div>)}
        </div>
    )
}
