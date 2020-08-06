import React from 'react'
import { Grid, Paper, Button } from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { addResponse, selectChoice } from "../redux/actions/responseActions"

export default function QuizResponse({quizId, inPreview}) {
    const { responses } = useSelector(state => state.response)
    const { questions } = useSelector(state => state.newQuiz)
    // const targetResponse = responses.filter(res => res.quizId == quizId)[0]
    return (
        <>
            <Grid container direction="column">
                {questions.map(question => 
                    <Grid item>
                        <Paper>
                            <Grid container>
                                <Grid item xs={12}>
                                    {question.question}
                                </Grid>
                                {question.choices.map(choice =>
                                    <Grid item xs={12} sm={6}>
                                        <Button>{choice.choice}</Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </>
    )
}
