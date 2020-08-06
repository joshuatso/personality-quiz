import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from "react-redux"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel, FormControl, InputLabel, OutlinedInput, FormHelperText } from "@material-ui/core"
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import { addOutcome, removeOutcome, setOutcomeOutcome, setOutcomeDescription } from "../redux/actions/newQuizActions"
import { uuid } from "uuidv4"

const useStyles = makeStyles((theme) => ({
    outcomesContainer: {
        overflow: "auto",
        width: "100%",
        padding: theme.spacing(2)
    },
    outcomesGrid: {
        overflow: "hidden"
    },
    outcomeContainer: {
        width: "100%"
    },
    outcomeButton: {
        height: 193,
        width: "100%"
    },
    outcomeGrid: {
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
    },
    outcomeOutcome: {
        flexShrink: 0,
        marginBottom: theme.spacing(1)
    },
    outcomeDescription: {
        flexGrow: 1
    },
    outcomeOutcomeInput: {
        width: "100%"
    },
    outcomeDescriptionInput: {
        width: "100%"
    }
}))

export default function OutcomeScreen({ displayOutcomeErrors, setOutcomeErrorIds, displayedOutcomeErrorIds }) {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { outcomes } = useSelector(state => state.newQuiz)

    useEffect(() => {
        setOutcomeErrorIds(outcomes.filter(o => o.outcome.length == 0).map(o => o.id))
    }, [outcomes])

    function renderOutcomeError(outcome) {
        return outcome.outcome.length == 0 && displayOutcomeErrors && displayedOutcomeErrorIds.filter(id => id == outcome.id).length != 0
    }

    return (
        <div className={classes.outcomesContainer}>
            <Grid container direction="row" spacing={2} wrap="wrap" alignContent="flex-start" className={classes.outcomesGrid}>
                {outcomes.map((outcome, index) =>
                    <Grid key={outcome.id + "card"} item xs={12} sm={6}>
                        <Paper className={classes.outcomeContainer}>
                            <div className={classes.outcomeGrid}>
                                <div className={classes.outcomeOutcome}>
                                    <FormControl variant="outlined" fullWidth error={renderOutcomeError(outcome)}>
                                        <InputLabel htmlFor={outcome.id + "outcomeInput"}>{`Outcome ${index+1}`} </InputLabel>
                                        <OutlinedInput id={outcome.id + "outcomeInput"} value={outcome.outcome} onChange={e => dispatch(setOutcomeOutcome(outcome.id, e.target.value))} label={`Outcome ${index+1}`}></OutlinedInput>
                                        <FormHelperText>{renderOutcomeError(outcome) ? "Enter an outcome." : ""}</FormHelperText>
                                    </FormControl>
                                </div>
                                <div className={classes.outcomeDescription}>
                                    <TextField 
                                        multiline 
                                        value={outcome.description} 
                                        label="Description" 
                                        className={classes.outcomeDescriptionInput} 
                                        rows={4} variant="outlined" 
                                        onChange={e => dispatch(setOutcomeDescription(outcome.id, e.target.value))}></TextField>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                    <Button className={classes.outcomeButton} onClick={() => dispatch(addOutcome({outcome: "", description: ""}))}>
                        Add Outcome
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}
