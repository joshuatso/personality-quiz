import React, { useState, useEffect, useCallback } from 'react'
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"

export default function OutcomeWeightToggler({weight, weightCallback}) {

    const toggleWeightCallback = useCallback(value => {
        weightCallback(value == weight ? 0 : value)
    }, [weight])

    return (
        <>
            <ToggleButtonGroup color="primary" size="medium" exclusive={false}>
                <ToggleButton value={1} selected={1 <= weight} onClick={() => toggleWeightCallback(1)}>.</ToggleButton>
                <ToggleButton value={2} selected={2 <= weight} onClick={() => toggleWeightCallback(2)}>.</ToggleButton>
                <ToggleButton value={3} selected={3 <= weight} onClick={() => toggleWeightCallback(3)}>.</ToggleButton>
                <ToggleButton value={4} selected={4 <= weight} onClick={() => toggleWeightCallback(4)}>.</ToggleButton>
                <ToggleButton value={5} selected={5 <= weight} onClick={() => toggleWeightCallback(5)}>.</ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}
