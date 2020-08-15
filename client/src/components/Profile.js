import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import axios from "axios"
import { uuid } from "uuidv4"
import { useDispatch, useSelector } from "react-redux"
import { setTitle, addQuestion, setQuestionQuestion, incrementQuestionIndex, decrementQuestionIndex, removeQuestion, setChoiceChoice, addChoice } from "../redux/actions/newQuizActions"
import { gql, useQuery } from "@apollo/client"
import { AppBar, Toolbar, Button, ButtonBase, Typography, InputBase, TextField, IconButton, Grid, Paper, Drawer, Chip, Fab, Zoom, Modal, Fade, Backdrop, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stepper, Step, StepLabel, Snackbar, Divider, CircularProgress } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import CssBaseline from '@material-ui/core/CssBaseline'
import { fade, makeStyles, useTheme } from "@material-ui/core/styles"
import EditIcon from "@material-ui/icons/Edit"
import MenuIcon from "@material-ui/icons/Menu"
import AddIcon from "@material-ui/icons/Add"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import SettingsIcon from "@material-ui/icons/Settings"
import DeleteIcon from "@material-ui/icons/Delete"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import TestInput from "./TestInput"
import QuestionScreen from "./QuestionScreen"
import OutcomeScreen from "./OutcomeScreen"
import DeployScreen from "./DeployScreen"
import logo from "../images/questionWithBackground.png"
import MyResponses from "./MyResponses"
import MyQuizzes from "./MyQuizzes"
import { Switch, Link, Route } from "react-router-dom"
import { FETCH_USER } from "../graphql/queries"

const useStyles = makeStyles((theme) => ({
    divStyling: {
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        margin: theme.spacing(1)
    },
    outerContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: theme.typography.fontFamily
    },
    upperContainer: {
        flexShrink: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    middleContainer: {
        flexShrink: 0,
        paddingLeft: 80,
        paddingRight: 50
    },
    lowerContainer: {
        flexGrow: 1
    },
    home: {
        margin: theme.spacing(2),
        flexShrink: 0,
        width: 46,
        height: 46,
        marginRight: theme.spacing(1)
    },
    banner: {
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(2),
        color: theme.palette.common.black,
        // backgroundColor: theme.palette.common.white,
        flexGrow: 1,
        marginLeft: theme.spacing(1),
        fontWeight: "bold",
        fontSize: 35,
        overflow: "hidden"
    },
    profilePicture: {
        borderRadius: theme.shape.borderRadius,
        margin: theme.spacing(2),
        fontSize: 50,
        flexShrink: 0,
        marginLeft: theme.spacing(1)
    },
    tabDivs: {
        flexShrink: 0
    }
    
}))

export default function Profile() {
    const classes = useStyles()
    const { loading: userLoading, error: userError, data: userData, refetch } = useQuery(FETCH_USER, {onError: reportErrors})

    function reportErrors(e) {
        console.log(e)
    }

    useEffect(() => {
        refetch()
    }, [])

    return(
        <>
            {!!userData ? 
            <>
            <CssBaseline/>
            <div className={classes.outerContainer}>
                <div className={classes.upperContainer}>
                    <div className={classes.home}><img src={logo} width={46}></img></div>
                    <div className={classes.banner}>
                        {`Hi ${userData.user.username}`}
                    </div>
                    <AccountCircleIcon color="primary" className={classes.profilePicture}></AccountCircleIcon>
                </div>
                <div className={classes.middleContainer}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Link to="/profile/responses">
                                <Button>My Responses</Button>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/profile/quizzes">
                                <Button>My Quizzes</Button>
                            </Link>
                        </Grid>
                    </Grid>
                </div>
                <Divider/>
                <div className={classes.lowerContainer}>
                    <Switch>
                        <Route path="/profile/responses">
                            <MyResponses></MyResponses>
                        </Route>
                        <Route path="/profile/quizzes">
                            <MyQuizzes quizzes={userData.user.quizzes}></MyQuizzes>
                        </Route>
                    </Switch>
                </div>
            </div>
            </>
            : <CircularProgress></CircularProgress>}
        </>
    )
}
