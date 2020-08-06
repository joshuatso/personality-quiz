import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex, removeQuestion, setChoiceChoice, addChoice } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel, Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import AddIcon from "@material-ui/icons/Add"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import DeleteIcon from "@material-ui/icons/Delete"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import QuestionScreen from "./QuestionScreen"
import OutcomeScreen from "./OutcomeScreen"
import DeployScreen from "./DeployScreen"
import logo from "../images/mainLogo.png"

const useStyles = makeStyles((theme) => ({
    outerContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "stretch"
    },
    lowerContainer: {
        display: "flex",
        flexGrow: 1,
        flexDirection: "row",
        overflow: "hidden"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    upperContainer: {
        flexShrink: 0,
    },
    upperContentContainer: {
        display: "flex"
    },
    stepperBackContainer: {
        flexShrink: 0
    },
    stepperBackButton: {
        height: "100%"
    },
    stepperContainer: {
        flexGrow: 1
    },
    stepperNextContainer: {
        flexShrink: 0
    },
    stepperNextButton:{
        height: "100%"
    },
    toolbar: {
        backgroundColor: theme.palette.primary.main
    },
    logoButton: {
        marginRight: theme.spacing(2)
    },
    logo: {
        width: 40
    },
    titleWrapper: {
        position: "relative"
    },
    editIcon: {
        height: "90%",
        padding: theme.spacing(0, 2),
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleInput: {
        ...theme.typography.h6,
        borderRadius: theme.shape.borderRadius,
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        "&:focus": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        color: theme.palette.primary.contrastText,
        width: "100%"
    }
}))

export default function ShowQuizzes() {
    const dispatch = useDispatch()
    const { title } = useSelector(state => state.newQuiz)
    const classes = useStyles()
    const [quizzes, setQuizzes] = useState([])
    const [activeStep, setActiveStep] = useState(0)
    const [openQuestionId, setOpenQuestionId] = useState(null)
    const [displayOutcomeErrors, setDisplayOutcomeErrors] = useState(false)
    const [displayOutcomeErrorBar, setDisplayOutcomeErrorBar] = useState(false)
    const [outcomeErrorIds, setOutcomeErrorIds] = useState([])
    const [displayedOutcomeErrorIds, setDisplayedOutcomeErrorIds] = useState([])
    const theme = useTheme()
    const { loading, error, data } = useQuery(gql`
        {
            quizzes {
                title
            }
        }
    `)

    const steps = ["Outcomes", "Questions", "Deploy", "Share"]

    function fetchQuizzes() {
        setQuizzes(data.quizzes.map(quiz => quiz.title))
    }

    function handleNext(){
        setDisplayOutcomeErrors(true)
        setDisplayedOutcomeErrorIds(outcomeErrorIds)
        if (activeStep == 0 && outcomeErrorIds.length != 0) {
            setDisplayOutcomeErrorBar(true)
            return
        }
        setActiveStep(prevActiveStep => prevActiveStep == steps.length-1 ? prevActiveStep : prevActiveStep+1)
    }

    function handleBack(){
        setDisplayOutcomeErrors(false)
        setActiveStep(prevActiveStep => prevActiveStep == 0 ? prevActiveStep : prevActiveStep-1)
    }

    return (
        <>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar classes={{root: classes.toolbar}}>
                <ButtonBase className={classes.logoButton}>
                    <img src={logo} className={classes.logo}></img>
                </ButtonBase>
                {/* <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="open drawer"
                >
                    <MenuIcon />
                </IconButton> */}
                <div className={classes.titleWrapper}>
                    <div className={classes.editIcon}>
                        <EditIcon></EditIcon>
                    </div>
                    <InputBase
                        classes={{
                            input: classes.titleInput
                        }}
                        value={title}
                        onChange={(e) => {dispatch(setTitle(e.target.value))}}
                    />
                </div>
            </Toolbar>
        </AppBar>
        <div className={classes.outerContainer}>
            <div className={classes.upperContainer}>
                <Toolbar />
                <div className={classes.upperContentContainer}>
                    <div className={classes.stepperBackContainer}>
                        <Button color="primary" className={classes.stepperBackButton} onClick={handleBack} disabled={activeStep == 0}>Back</Button>
                    </div>
                    <div className={classes.stepperContainer}>
                        <Stepper alternativeLabel activeStep={activeStep}>
                            {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                            ))}
                        </Stepper>
                    </div>
                    <div className={classes.stepperNextContainer}>
                        <Button color="primary" className={classes.stepperNextButton} onClick={handleNext} disabled={activeStep == steps.length-1}>Next</Button>
                    </div>
                </div>
            </div>
            <div className={classes.lowerContainer}>
                {[
                    <OutcomeScreen displayOutcomeErrors={displayOutcomeErrors} setOutcomeErrorIds={setOutcomeErrorIds} displayedOutcomeErrorIds={displayedOutcomeErrorIds}></OutcomeScreen>,
                    <QuestionScreen openQuestionId={openQuestionId} setOpenQuestionId={setOpenQuestionId}></QuestionScreen>,
                    <DeployScreen></DeployScreen>,
                    null
                ][activeStep]}
                {/* <Button onClick={() => {fetchQuizzes()}}>Show Quizzes</Button>
                {quizzes.map(quiz => <div key={uuid()}>{quiz}</div>)} */}
            </div>
        </div>
        <Snackbar open={displayOutcomeErrorBar} autoHideDuration={6000} onClose={() => setDisplayOutcomeErrorBar(false)}>
            <Alert elevation={6} variant="filled" severity="error">
                There were some errors on the outcomes screen.
            </Alert>
        </Snackbar>
        </>
    )
}
