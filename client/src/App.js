import React, {useEffect} from 'react';
import './App.css';
import ShowQuizzes from "./components/ShowQuizzes"
import TestInput from "./components/TestInput"
import Profile from "./components/Profile"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import NewQuiz from "./components/NewQuiz"
import QuizResponse from "./components/QuizResponse"
import {Switch, Route} from "react-router-dom"
import CssBaseline from '@material-ui/core/CssBaseline'

function App() {

  return (
    <>
      <CssBaseline/>
      <Switch>
        <Route path="/editQuiz/:id">
          <ShowQuizzes></ShowQuizzes>
        </Route>
        <Route path="/preview/:id">
          <QuizResponse inPreview></QuizResponse>
        </Route>
        <Route path="/response/:id">
          <QuizResponse></QuizResponse>
        </Route>
        <Route path="/newQuiz">
          <NewQuiz></NewQuiz>
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
