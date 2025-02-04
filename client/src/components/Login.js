import React, { useState, useEffect } from 'react'
import { TextField, Button, CircularProgress, Grid } from "@material-ui/core"
import { gql, useMutation } from "@apollo/client"
import { LOGIN_USER } from "../graphql/mutations"
import { USERNAME_NOT_FOUND, PASSWORD_INCORRECT } from "../graphql/errors"
import { Redirect, useHistory } from "react-router-dom"

export default function Login() {
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [overallError, setOverallError] = useState(null)
    const [loginLoading, setLoginLoading] = useState(null)
    const [loginUser, {client}] = useMutation(LOGIN_USER, {onError: reportErrors, onCompleted: loginCompleted})
    const history = useHistory()

    function validateInput() {
        if (usernameInput.length == 0) setUsernameError("Please enter a username")
        else setUsernameError(null)
        if (passwordInput.length == 0) setPasswordError("Please enter a password")
        else setPasswordError(null)
        return usernameInput.length != 0 && passwordInput.length != 0
    }

    function reportErrors(error) {
        switch (error.message) {
            case USERNAME_NOT_FOUND:
                setUsernameError(USERNAME_NOT_FOUND)
                break
            case PASSWORD_INCORRECT:
                setPasswordError(PASSWORD_INCORRECT)
                break
            default:
                setOverallError(error.message)
        }
    }

    async function loginCompleted(data) {
        setLoginLoading(true)
        localStorage.setItem("token", data.authenticateUser.token)
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
            <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                    <Button onClick={() => {
                        if (validateInput()) loginUser({variables: {username: usernameInput, password: passwordInput}})
                    }}>Login</Button>
                </Grid>
                <Grid item>
                    {loginLoading ? <CircularProgress size={20}></CircularProgress> : null}
                </Grid>
            </Grid>
        </>
    )
}
