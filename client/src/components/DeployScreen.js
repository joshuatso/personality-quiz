import React from 'react'
import { Button } from "@material-ui/core"
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"

export default function DeployScreen() {
    const {id} = useSelector(state => state.newQuiz)
    return (
        <Link to={`/preview/${id}`}>
            <Button variant="contained" color="primary">Preview</Button>
        </Link>
    )
}
