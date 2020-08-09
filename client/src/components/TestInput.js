import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from "@apollo/client"
import {TextField, Button} from "@material-ui/core"
import { useSelector, useDispatch } from "react-redux"
import { createQuiz } from "../redux/actions/newQuizActions"

const UPDATE_NOTE = gql`
    mutation AddNote($note: String!) {
        updateNote(id: "5f2f2093959a87354beca2c0", note: $note) {
            id,
            note
        }
    }
`

export default function TestInput() {
    const { id } = useSelector(state => state.newQuiz)
    const dispatch = useDispatch()

    return (
        <div>
            <div>{id}</div>
            <Button onClick={() => dispatch(createQuiz())}>Create Quiz</Button>
        </div>
    )
}
