import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom } from "@material-ui/core"
import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import AddIcon from "@material-ui/icons/Add"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
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
    }
}))

export default function ShowQuizzes() {
    const dispatch = useDispatch()
    const { title, questions } = useSelector(state => state.newQuiz)
    const classes = useStyles()
    const [quizzes, setQuizzes] = useState([])
    const [openQuestionId, setopenQuestionId] = useState(null)
    const [showFab, setShowFab] = useState(false)
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
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.complex
    }

    function fetchQuizzes() {
        setQuizzes(data.quizzes.map(quiz => quiz.title))
    }

    let closeFab

    const setCloseFab = () => {
        closeFab = setTimeout(() => {setShowFab(false)}, 2000)
    }

    const clearCloseFab = () => {
        clearTimeout(closeFab)
    }

    const handleEditQuestionMouseMove = useCallback(
        () => {
            clearCloseFab()
            setShowFab(true)
            setCloseFab()
        }, [])

    useEffect(() => {
        console.log(showFab)
    }, [showFab])

    useLayoutEffect(() => {
        if (openQuestionId == "last") {
            setopenQuestionId(questions[questions.length-1].id)
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
                            <ButtonBase className={classes.questionButton} onClick={() => {setopenQuestionId(question.id)}}>
                                <Typography noWrap variant="h6">
                                    {`Question ${findQuestionIndexById(question.id)+1}: ${question.question}`}
                                </Typography>
                            </ButtonBase>
                        </Paper>)
                    }
                    <Button className={classes.addQuestionButton} onClick={() => {
                        dispatch(addQuestion({ question: "", choices: [] }))
                        setopenQuestionId("last")
                    }}>
                        <AddIcon></AddIcon>
                    </Button>
                </div>
            </Drawer>
            <div className={classes.editQuestionContainer} onMouseMove={handleEditQuestionMouseMove}>
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
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == 0} className={classes.shiftFab} onClick={() => {dispatch(decrementQuestionIndex(openQuestionId))}}>
                                            <ArrowUpwardIcon></ArrowUpwardIcon>
                                        </Fab>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={transitionDuration}>
                                        <Fab size="medium" disabled={findQuestionIndexById(openQuestionId) == questions.length-1} className={classes.shiftFab} onClick={() => {dispatch(incrementQuestionIndex(openQuestionId))}}>
                                            <ArrowDownwardIcon></ArrowDownwardIcon>
                                        </Fab>
                                    </Zoom>
                                </Grid>
                                <Grid item>
                                    <Zoom in={showFab} timeout={transitionDuration}>
                                        <Fab size="medium" color="secondary">
                                            <DeleteForeverIcon></DeleteForeverIcon>
                                        </Fab>
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
        </>
    )
}
