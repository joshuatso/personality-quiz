import React, {useState, useEffect} from 'react'
import { Grid, Paper, Button } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { createResponse, selectChoice } from "../redux/actions/responseActions"
import {useParams} from "react-router-dom"
import {useQuery, useMutation} from "@apollo/client"
import { FETCH_QUIZ_FOR_RESPONSE } from "../graphql/queries"
import { ADD_RESPONSE } from "../graphql/mutations"

export default function QuizResponse({inPreview}) {
    const {answers} = useSelector(state => state.response)
    const [questions, setQuestions] = useState([])
    const {id: quizID} = useParams()
    const {data: quizData} = useQuery(FETCH_QUIZ_FOR_RESPONSE, {variables: {id: quizID}, onError: reportErrors})
    const [addResponse, {data: responseData}] = useMutation(ADD_RESPONSE, {onError: reportErrors})
    const dispatch = useDispatch()

    function reportErrors(e) {
        console.log(e)
    }

    useEffect(() => {
        if (quizData) {
            setQuestions(quizData.quiz.questions)
        }
    }, [quizData])

    useEffect(() => {
        dispatch(createResponse(quizID))
    }, [])
    
    return (
        <>
            <Grid container direction="column" spacing={2}>
                {questions.map(question => 
                    <Grid item>
                        <Paper>
                            <Grid direction="row" container>
                                <Grid item xs={12}>
                                    {question.question}
                                </Grid>
                                {question.choices.map(choice =>
                                    <Grid item xs={12} sm={6}>
                                        <Button onClick={() => dispatch(selectChoice(question.id, choice.id))}>{choice.choice}</Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                <Grid item>
                    <Button onClick={() => { console.log({quizID, answers})
                        addResponse({variables: {quizID, answers}})}}>Submit</Button>
                </Grid>
            </Grid>
        </>
    )
}
