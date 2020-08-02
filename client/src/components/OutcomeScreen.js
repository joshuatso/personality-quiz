import React from 'react'

import { useSelector, useDispatch } from "react-redux"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel } from "@material-ui/core"
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import { addOutcome, removeOutcome, setOutcomeOutcome } from "../redux/actions/newQuizActions"

const useStyles = makeStyles((theme) => ({
    outcomesContainer: {
        width: "100%"
    },
    outcomeContainer: {
        height: 200,
        width: "100%"
    }
}))

export default function OutcomeScreen() {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { outcomes } = useSelector(state => state.newQuiz)

    return (
        <>
            <Grid container direction="row" spacing={2} alignItems="flex-start">
                {outcomes.map(outcome =>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.outcomeContainer}>
                            <TextField value={outcome.outcome} onChange={e => dispatch(setOutcomeOutcome(outcome.id, e.target.value))}></TextField>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button className={classes.outcomeContainer} onClick={() => dispatch(addOutcome({outcome: ""}))}>
                        Add Outcome
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
