import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex, removeQuestion } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop } from "@material-ui/core"
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
    root: {
        display: 'flex',
        height: "100vh",
        alignItems: "stretch"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        flexShrink: 0,
        width: 340
    },
    drawerPaper: {
        backgroundColor: theme.palette.grey[100],
        width: 340
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: {
        backgroundColor: theme.palette.info.main
    },
    menuButton: {
        marginRight: theme.spacing(2),
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
    },
    questionListContainer: {
        // borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        padding: theme.spacing(2),
        paddingRight: 0
    },
    questionPaper: {
        height: 48,
        width: 300,
        marginBottom: theme.spacing(0.5)
    },
    openQuestionPaper: {
        backgroundColor: theme.palette.info.light
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
        borderColor: theme.palette.info.light,
        color: theme.palette.info.light,
        "&:hover": {
            borderColor: theme.palette.info.main,
            color: theme.palette.info.main,
            backgroundColor: theme.palette.common.white
        },
        height: 48,
        width: 300,
        padding: '0 30px'
    },
    editQuestionContainer: {
        position: "relative",
        padding: theme.spacing(2),
        flexGrow: 1
    },
    questionHeader: {
        ...theme.typography.h6,
        marginBottom: theme.spacing(1)
    },
    promptInput: {
        width: "100%"
    },
    fabContainer: {
        position: "absolute",
        display: "inline-block",
        bottom: theme.spacing(2),
        left: theme.spacing(2)
    },
    fabGrid: {
        spacing: theme.spacing(1)
    },
    shiftFab: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.common.white,
        "&:hover": {
            backgroundColor: theme.palette.info.dark
        }
    },
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalTypography: {
        marginBottom: theme.spacing(2)
    },
    modalPaper: {
        padding: theme.spacing(2)
    }
}))

export default function ShowQuizzes() {
    const dispatch = useDispatch()
    const { title, questions } = useSelector(state => state.newQuiz)
    const classes = useStyles()
    const [quizzes, setQuizzes] = useState([])
    const [openQuestionId, setOpenQuestionId] = useState(null)
    const [fabTimeoutId, setFabTimeoutId] = useState(null)
    const [showFab, setShowFab] = useState(false)
    const [fabAnimation, setFabAnimation] = useState(true)
    const [mouseOverFab, setMouseOverFab] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const theme = useTheme()
    const { loading, error, data } = useQuery(gql`
        {
            quizzes {
                title
            }
        }
    `)

    const findQuestionById = id => questions.filter(question => question.id == id)[0]
    const findQuestionIndexById = id => questions.findIndex(question => question.id == id)

    const transitionDuration = {
        enter: fabAnimation ? theme.transitions.duration.enteringScreen : 0,
        exit: theme.transitions.duration.complex
    }

    function fetchQuizzes() {
        setQuizzes(data.quizzes.map(quiz => quiz.title))
    }

    function handleDeleteFab() {
        const openQuestion = findQuestionById(openQuestionId)
        if (openQuestion.question == "" && openQuestion.choices.length == 0) {
            handleDeleteQuestion()
        } else {
            setModalOpen(true)
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
                if (!(mouseOverFab || modalOpen)) {
                    fabFunctions.setCloseFab()
                }
            }
        }, [openQuestionId, mouseOverFab, modalOpen])

    useEffect(() => {
        setFabAnimation(false)
    }, [questions.length])

    useEffect(() => {
        handleShowFab()
    }, [mouseOverFab, modalOpen])

    useLayoutEffect(() => {
        if (openQuestionId == "last") {
            setOpenQuestionId(questions[questions.length-1].id)
        }
    }, [openQuestionId])

    return (
        <>
        <CssBaseline />
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar classes={{root: classes.toolbar}}>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
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
            <Drawer variant="permanent" className={classes.drawer} classes={{paper: classes.drawerPaper}}>
                <Toolbar />
                <div className={classes.questionListContainer}>
                    {questions.map(question => 
                        <Paper key={question.id} className={`${classes.questionPaper} ${question.id == openQuestionId ? classes.openQuestionPaper : null}`}>
                            <ButtonBase className={classes.questionButton} onClick={() => {setOpenQuestionId(question.id)}}>
                                <Typography noWrap variant="h6">
                                    {`Question ${findQuestionIndexById(question.id)+1}: ${question.question}`}
                                </Typography>
                            </ButtonBase>
                        </Paper>)
                    }
                    <Button className={classes.addQuestionButton} onClick={() => {
                        dispatch(addQuestion({ question: "", choices: [] }))
                        setOpenQuestionId("last")
                    }}>
                        <AddIcon></AddIcon>
                    </Button>
                </div>
            </Drawer>
            <div className={classes.editQuestionContainer} onMouseMove={handleShowFab}>
                <Toolbar />
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
                        <div className={classes.fabContainer}>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Zoom in={showFab} timeout={transitionDuration}>
                                        <div onMouseOver={() => setMouseOverFab(true)} onMouseLeave={() => setMouseOverFab(false)}> 
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == 0} className={classes.shiftFab} onClick={() => {dispatch(decrementQuestionIndex(openQuestionId))}}>
                                            <ArrowUpwardIcon></ArrowUpwardIcon>
                                        </Fab>
                                        </div>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={transitionDuration}>
                                        <div onMouseOver={() => setMouseOverFab(true)} onMouseLeave={() => setMouseOverFab(false)}> 
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == questions.length-1} className={classes.shiftFab} onClick={() => {dispatch(incrementQuestionIndex(openQuestionId))}} onMouseOver={() => {setMouseOverFab(true)}}>
                                            <ArrowDownwardIcon></ArrowDownwardIcon>
                                        </Fab>
                                        </div>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={transitionDuration}>
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
            {/* <Button onClick={() => {fetchQuizzes()}}>Show Quizzes</Button>
            {quizzes.map(quiz => <div key={uuid()}>{quiz}</div>)} */}
        </div>
        <Modal
            className={classes.modal}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
        >
            <Fade in={modalOpen}>
                <Paper className={classes.modalPaper}>
                    <Typography variant="h6" className={classes.modalTypography}>
                        Are you sure you want to delete this question?
                    </Typography>
                    <Grid container direction="row" spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="default" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={() => {
                                handleDeleteQuestion()
                                setModalOpen(false)
                            }}>Yes</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
        </Modal>
        </>
    )
}
