import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { setWeight } from "../redux/actions/newQuizActions"
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"
import { makeStyles } from "@material-ui/styles"
import { pure, shouldUpdate } from "recompose"

const weightColors = ["#e9fbf8", "#bef3e9", "#93ebdb", "#68e3cd", "#3ddbbe"]

const OutcomeWeightToggler = ({ questionID, choiceID, outcomeID, weight }) => {
    const dispatch = useDispatch()
    
    const classes = makeStyles({
        toggleButtonSelected: weight => ({
            backgroundColor: weightColors[weight-1] + " !important"
        })
    })

    const toggleWeightCallback = useCallback(value => {
        dispatch(setWeight(questionID, choiceID, outcomeID, value == weight ? 0 : value))
    }, [weight])

    return (
        <>
            <ToggleButtonGroup color="primary" size="medium" exclusive={false}>
                <ToggleButton value={1} selected={1 <= weight} classes={{selected: classes(1).toggleButtonSelected}} onClick={() => toggleWeightCallback(1)}><></></ToggleButton>
                <ToggleButton value={2} selected={2 <= weight} classes={{selected: classes(2).toggleButtonSelected}} onClick={() => toggleWeightCallback(2)}><></></ToggleButton>
                <ToggleButton value={3} selected={3 <= weight} classes={{selected: classes(3).toggleButtonSelected}} onClick={() => toggleWeightCallback(3)}><></></ToggleButton>
                <ToggleButton value={4} selected={4 <= weight} classes={{selected: classes(4).toggleButtonSelected}} onClick={() => toggleWeightCallback(4)}><></></ToggleButton>
                <ToggleButton value={5} selected={5 <= weight} classes={{selected: classes(5).toggleButtonSelected}} onClick={() => toggleWeightCallback(5)}><></></ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

const checkPropsChange = (props, nextProps) => nextProps.weight !== props.weight

export default shouldUpdate(checkPropsChange)(OutcomeWeightToggler)