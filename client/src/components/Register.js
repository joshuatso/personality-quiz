import React, { useState, useEffect } from 'react'
import { TextField, Button, CircularProgress, Grid } from "@material-ui/core"
import { gql, useMutation } from "@apollo/client"
import { REGISTER_USER } from "../graphql/mutations"
import { USERNAME_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS } from "../graphql/errors"
import { Redirect, useHistory } from "react-router-dom"

export default function Register() {
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [overallError, setOverallError] = useState(null)
    const [registerLoading, setRegisterLoading] = useState(null)
    const [registerUser, {client}] = useMutation(REGISTER_USER, {onError: reportErrors, onCompleted: registerCompleted})
    const history = useHistory()

    function validateInput() {
        if (usernameInput.length == 0) setUsernameError("Please enter a username")
        else setUsernameError(null)
        if (passwordInput.length == 0) setPasswordError("Please enter a password")
        else setPasswordError(null)
        if (emailInput.length == 0) setEmailError("Please enter an email")
        else setEmailError(null)
        return usernameInput.length != 0 && passwordInput.length != 0 && emailInput.length != 0
    }

    function reportErrors(error) {
        switch (error.message) {
            case USERNAME_ALREADY_EXISTS:
                setUsernameError(USERNAME_ALREADY_EXISTS)
                break
            case EMAIL_ALREADY_EXISTS:
                setEmailError(EMAIL_ALREADY_EXISTS)
                break
            default:
                setOverallError(error.message)
        }
    }

    async function registerCompleted(data) {
        setRegisterLoading(true)
        localStorage.setItem("token", data.addUser.token)
        const resetStore = await client.resetStore()
        history.push("/profile")
    }

    return (
        <>
            <div>
                <TextField error={!!usernameError} helperText={usernameError} value={usernameInput} label="Username" onChange={e => setUsernameInput(e.target.value)}></TextField>
            </div>
            <div>
                <TextField error={!!passwordError} helperText={passwordError} value={passwordInput} label="Password" onChange={e => setPasswordInput(e.target.value)}></TextField>
            </div>
            <div>
                <TextField error={!!emailError} helperText={emailError} value={emailInput} label="Email" onChange={e => setEmailInput(e.target.value)}></TextField>
            </div>
            <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                    <Button onClick={() => {
                        if (validateInput()) registerUser({variables: {username: usernameInput, password: passwordInput, email: emailInput}})
                    }}>Register</Button>
                </Grid>
                <Grid item>
                    {registerLoading ? <CircularProgress size={20}></CircularProgress> : null}
                </Grid>
            </Grid>
        </>
    )
}
