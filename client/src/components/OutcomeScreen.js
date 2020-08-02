import React from 'react'

export default function OutcomeScreen() {
    return (
        <div>
            <Grid container direction="row" spacing={2} alignItems="stretch">
                <Grid item xs={12} md={6} className={classes.choiceContainer}>
                    <Button className={classes.choiceInput} onClick={() => dispatch(addChoice(openQuestionId, {choice: ""}))}>Add a choice</Button>
                </Grid>
            </Grid>
        </div>
    )
}
