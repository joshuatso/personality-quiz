import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex, removeQuestion, setChoiceChoice, addChoice, setWeight } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ButtonGroup } from "@material-ui/core"
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"
import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import AddIcon from "@material-ui/icons/Add"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import DeleteIcon from "@material-ui/icons/Delete"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import OutcomeWeightToggler from "./OutcomeWeightToggler"

const useStyles = makeStyles((theme) => ({
    questionListContainer: {
        // borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        padding: theme.spacing(2),
        paddingRight: 0,
        flexShrink: 0,
        backgroundColor: theme.palette.grey[100],
        width: 340,
        overflow: "auto"
    },
    questionContainer: {
        position: "relative"
    },
    questionPaper: {
        position: "relative",
        height: 48,
        width: 300,
        marginBottom: theme.spacing(0.5),
        "&:hover": {
            backgroundColor: theme.palette.primary.superLight
        },
        zIndex: 101
    },
    openQuestionPaper: {
        backgroundColor: theme.palette.primary.light
    },
    questionButton: {
        padding: theme.spacing(1),
        height: "100%",
        width: "100%"
    },
    addQuestionButton: {
        backgroundColor: theme.palette.common.white,
        borderStyle: "dashed",
        borderWidth: "2px",
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
        "&:hover": {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main
        },
        height: 48,
        width: 300,
        padding: '0 30px'
    },
    fakeAddQuestionButton: {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.common.white,
        borderStyle: "dashed",
        borderWidth: "2px",
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        height: 48,
        width: 300,
        padding: '0 30px',
        borderRadius: theme.shape.borderRadius,
        zIndex: 100
    },
    editQuestionContainer: {
        position: "relative",
        padding: theme.spacing(2),
        flexGrow: 1,
        overflow: "auto"
    },
    questionHeaderContainer: {
        position: "relative",
        ...theme.typography.h6,
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(2)
    },
    questionHeaderLabel: {
        marginRight: theme.spacing(1),
        flexShrink: 0
    },
    promptInput: {
        flexGrow: 1
    },
    fabContainer: {
        position: "fixed",
        bottom: theme.spacing(3),
        right: theme.spacing(3)
    },
    fabGrid: {
        spacing: theme.spacing(1)
    },
    shiftFab: {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: theme.palette.primary.main
        }
    },
    disabledShiftFab: {
        backgroundColor: theme.palette.grey[500]
    },
    choicesContainer:{
        width: "100%"
    },
    choiceContainer:{
        position: "relative",
        height: 64
    },
    choiceInput: {
        width: 200,
        height: "100%"
    },
    choiceTable: {
        // minWidth: "750"
    },
    addChoiceButton: {
        height: "100%",
        width: "100%"
    }
}))

export default function QuestionScreen({openQuestionId, setOpenQuestionId}) {
    const dispatch = useDispatch()
    const { questions, outcomes } = useSelector(state => state.newQuiz)
    const classes = useStyles()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [showAddQuestion, setShowAddQuestion] = useState(true)
    const [questionListAnimation, setQuestionListAnimation] = useState(false)
    const theme = useTheme()

    const findQuestionById = id => questions.filter(question => question.id == id)[0]
    const findQuestionIndexById = id => questions.findIndex(question => question.id == id)

    function handleDeleteFab() {
        const openQuestion = findQuestionById(openQuestionId)
        if (openQuestion.question == "" && openQuestion.choices.length == 0) {
            handleDeleteQuestion()
        } else {
            setDialogOpen(true)
        }
    }

    function handleDeleteQuestion() {
        if (questions.length == 1) {
            setOpenQuestionId(null)
        } else {
            const openQuestionIndex = findQuestionIndexById(openQuestionId)
            if (openQuestionIndex == 0) {
                setOpenQuestionId(questions[1].id)
            } else {
                setOpenQuestionId(questions[openQuestionIndex-1].id)
            }
        }
        dispatch(removeQuestion(openQuestionId))
    }

    useLayoutEffect(() => {
        if(!showAddQuestion) {
            setShowAddQuestion(true)
        }
    }, [showAddQuestion])

    useLayoutEffect(() => {
        if (openQuestionId == "last") {
            setOpenQuestionId(questions[questions.length-1].id)
        }
    }, [openQuestionId])

    return (
        <>
            <div className={classes.questionListContainer}>
                {questions.map((question, index) => 
                    <div key={index} className={classes.questionContainer}>
                        <div className={classes.fakeAddQuestionButton}>
                            <AddIcon></AddIcon>
                        </div>
                        <Fade in timeout={questionListAnimation ? 500 : 0}>
                            <Paper key={question.id} className={`${classes.questionPaper} ${question.id == openQuestionId ? classes.openQuestionPaper : null}`}>
                                <ButtonBase className={classes.questionButton} onClick={() => {setOpenQuestionId(question.id)}}>
                                    <Typography noWrap variant="h6">
                                        {`${index+1}. ${question.question}`}
                                    </Typography>
                                </ButtonBase>
                            </Paper>
                        </Fade>
                    </div>)
                }
                <Fade 
                    in={showAddQuestion} 
                    timeout={{enter: 1000, exit: 0}}>
                    <Button className={classes.addQuestionButton} onClick={() => {
                        dispatch(addQuestion({ question: "", choices: [] }))
                        setOpenQuestionId("last")
                        setShowAddQuestion(false)
                        setQuestionListAnimation(true)
                    }}>                        
                        <AddIcon></AddIcon>
                    </Button>
                </Fade>
            </div>
            <div className={classes.editQuestionContainer}>
                {openQuestionId && openQuestionId != "last" ? 
                    <>
                        <div className={classes.questionHeaderContainer}>
                            <div className={classes.questionHeaderLabel}>
                                {`Question ${findQuestionIndexById(openQuestionId)+1}:`}
                            </div>
                            <TextField 
                                label="Prompt" 
                                variant="outlined" 
                                value={findQuestionById(openQuestionId).question}
                                className={classes.promptInput}
                                onChange={e => dispatch(setQuestionQuestion(openQuestionId, e.target.value))}
                            >
                            </TextField>
                        </div>
                        <TableContainer component={Paper}>
                            <Table size="small" className={classes.choicesTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Choice</TableCell>
                                        {outcomes.map(outcome => 
                                            <TableCell key={outcome.id + "head"}>{outcome.outcome}</TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {findQuestionById(openQuestionId).choices.map((choice, index) =>
                                        <TableRow key={index} hover>
                                            <TableCell className={classes.choiceContainer}>
                                                <TextField label={`Choice ${index+1}`} value={choice.choice} onChange={e => dispatch(setChoiceChoice(openQuestionId, choice.id, e.target.value))} className={classes.choiceInput}></TextField>
                                            </TableCell>
                                            {outcomes.map(outcome => {
                                                    const weightArray = choice.weights.filter(weight => weight.outcomeId == outcome.id)
                                                    return (
                                                    <TableCell key={outcome.id + "cell"}>
                                                        <OutcomeWeightToggler questionId={openQuestionId} choiceId={choice.id} outcomeId={outcome.id} weight={weightArray.length != 0 ? weightArray[0].weight : 0} ></OutcomeWeightToggler>
                                                    </TableCell>)
                                            })}
                                        </TableRow>
                                    )}
                                    <TableRow className={classes.choiceContainer}>
                                        <TableCell colSpan={outcomes.length+1}>
                                            <Button className={classes.addChoiceButton} onClick={() => dispatch(addChoice(openQuestionId, {choice: "", weights: []}))}>Add a choice</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <div className={classes.choicesContainer}>
                            <Grid container direction="row" spacing={2} alignItems="stretch">
                                {findQuestionById(openQuestionId).choices.map((choice, index) =>
                                    <Grid item xs={12} md={6} className={classes.choiceContainer}>
                                        <TextField label={`Choice ${index+1}`} value={choice.choice} onChange={e => dispatch(setChoiceChoice(openQuestionId, choice.id, e.target.value))} className={classes.choiceInput}></TextField>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6} className={classes.choiceContainer}>
                                    <Button className={classes.choiceInput} onClick={() => dispatch(addChoice(openQuestionId, {choice: "", weights: []}))}>Add a choice</Button>
                                </Grid>
                            </Grid>
                        </div> */}
                        {/* <div className={classes.fabContainer}>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Zoom in={showFab} timeout={fabTransitionDuration}>
                                        <div onMouseOver={() => setMouseOverFab(true)} onMouseLeave={() => setMouseOverFab(false)}> 
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == 0} className={classes.shiftFab} onClick={() => {dispatch(decrementQuestionIndex(openQuestionId))}}>
                                            <ArrowUpwardIcon></ArrowUpwardIcon>
                                        </Fab>
                                        </div>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={fabTransitionDuration}>
                                        <div onMouseOver={() => setMouseOverFab(true)} onMouseLeave={() => setMouseOverFab(false)}> 
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == questions.length-1} className={classes.shiftFab} onClick={() => {dispatch(incrementQuestionIndex(openQuestionId))}} onMouseOver={() => {setMouseOverFab(true)}}>
                                            <ArrowDownwardIcon></ArrowDownwardIcon>
                                        </Fab>
                                        </div>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={fabTransitionDuration}>
                                        <div onMouseOver={() => setMouseOverFab(true)} onMouseLeave={() => setMouseOverFab(false)}> 
                                        <Fab size="medium" color="secondary" onClick={handleDeleteFab} onMouseOver={() => {setMouseOverFab(true)}}>
                                            <DeleteIcon></DeleteIcon>
                                        </Fab>
                                        </div>
                                    </Zoom>
                                </Grid>
                            </Grid>
                        </div> */}
                    </>
                : null}
            </div>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            >
                <DialogTitle>
                    Are you sure you want to delete this question?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have made changes, this action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                            handleDeleteQuestion()
                            setDialogOpen(false)
                        }} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
