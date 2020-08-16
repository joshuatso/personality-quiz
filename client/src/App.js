import React, {useEffect} from 'react';
import './App.css';
import ShowQuizzes from "./components/ShowQuizzes"
import TestInput from "./components/TestInput"
import Profile from "./components/Profile"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import NewQuizLoading from "./components/NewQuizLoading"
import {Switch, Route} from "react-router-dom"
import CssBaseline from '@material-ui/core/CssBaseline'

function App() {

  return (
    <>
      <CssBaseline/>
      <Switch>
        <Route path="/newQuiz/:id">
          <ShowQuizzes></ShowQuizzes>
        </Route>
        <Route path="/newQuiz">
          <NewQuizLoading></NewQuizLoading>
        </Route>
        <Route path="/profile">
          <Profile></Profile>
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/register">
          <Register></Register>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
      </Switch>
      {/* <TestInput></TestInput> */}
    </>
  )
}

export default App;
