import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex, removeQuestion, setChoiceChoice, addChoice } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel } from "@material-ui/core"
import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import AddIcon from "@material-ui/icons/Add"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import DeleteIcon from "@material-ui/icons/Delete"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"

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
    questionHeader: {
        ...theme.typography.h6,
        marginBottom: theme.spacing(1)
    },
    promptInput: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    fabContainer: {
        position: "fixed",
        bottom: theme.spacing(2),
        left: `calc(340 + ${theme.spacing(2)})`
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
        width: "100%",
        height: "100%"
    }
}))

export default function QuestionScreen() {
    const dispatch = useDispatch()
    const { title, questions } = useSelector(state => state.newQuiz)
    const classes = useStyles()
    const [openQuestionId, setOpenQuestionId] = useState(null)
    const [fabTimeoutId, setFabTimeoutId] = useState(null)
    const [showFab, setShowFab] = useState(false)
    const [fabAnimation, setFabAnimation] = useState(true)
    const [mouseOverFab, setMouseOverFab] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [showAddQuestion, setShowAddQuestion] = useState(true)
    const theme = useTheme()

    const findQuestionById = id => questions.filter(question => question.id == id)[0]
    const findQuestionIndexById = id => questions.findIndex(question => question.id == id)

    const fabTransitionDuration = {
        enter: fabAnimation ? theme.transitions.duration.enteringScreen : 0,
        exit: theme.transitions.duration.complex
    }

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

    const fabFunctions = (() => {
        let closeFab
        return {
            setCloseFab: () => {
                closeFab = setTimeout(() => {setShowFab(false)}, 2000)
                setFabTimeoutId(closeFab)
            },
            clearCloseFab: () => {
                clearTimeout(closeFab)
                clearTimeout(fabTimeoutId)
            }
        }
    })()

    const handleShowFab = useCallback(
        () => {
            fabFunctions.clearCloseFab()
            if (openQuestionId) {
                setFabAnimation(true)
                setShowFab(true)
                if (!(mouseOverFab || dialogOpen)) {
                    fabFunctions.setCloseFab()
                }
            }
        }, [openQuestionId, mouseOverFab, dialogOpen])

    useEffect(() => {
        setFabAnimation(false)
    }, [questions.length])

    useEffect(() => {
        handleShowFab()
    }, [mouseOverFab, dialogOpen])

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
                    <div className={classes.questionContainer}>
                        <div className={classes.fakeAddQuestionButton}>
                            <AddIcon></AddIcon>
                        </div>
                        <Fade in timeout={500}>
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
                    }}>                        
                        <AddIcon></AddIcon>
                    </Button>
                </Fade>
            </div>
            <div className={classes.editQuestionContainer} onMouseMove={handleShowFab}>
                {openQuestionId && openQuestionId != "last" ? 
                    <>
                        <div className={classes.questionHeader}>
                            {`Question ${findQuestionIndexById(openQuestionId)+1}`}
                        </div>
                        <TextField 
                            label="Prompt" 
                            variant="outlined" 
                            value={findQuestionById(openQuestionId).question}
                            className={classes.promptInput}
                            onChange={e => dispatch(setQuestionQuestion(openQuestionId, e.target.value))}
                        >
                        </TextField>
                        <div className={classes.choicesContainer}>
                            <Grid container direction="row" spacing={2} alignItems="stretch">
                                {findQuestionById(openQuestionId).choices.map((choice, index) =>
                                    <Grid item xs={12} md={6} className={classes.choiceContainer}>
                                        <TextField label={`Choice ${index+1}`} value={choice.choice} onChange={e => dispatch(setChoiceChoice(openQuestionId, choice.id, e.target.value))} className={classes.choiceInput}></TextField>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6} className={classes.choiceContainer}>
                                    <Button className={classes.choiceInput} onClick={() => dispatch(addChoice(openQuestionId, {choice: ""}))}>Add a choice</Button>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.fabContainer}>
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
                        </div>
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
                        You have made changes. This action is irreversible.
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
