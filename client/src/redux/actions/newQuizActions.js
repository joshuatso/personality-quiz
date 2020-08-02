import {
    CLEAR_QUIZ,
    SET_TITLE,
    ADD_OUTCOME,
    REMOVE_OUTCOME,
    SET_OUTCOME_OUTCOME,
    ADD_QUESTION,
    REMOVE_QUESTION,
    SET_QUESTION_QUESTION,
    ADD_CHOICE,
    REMOVE_CHOICE,
    SET_CHOICE_CHOICE,
    SET_WEIGHT,
    INCREMENT_QUESTION_INDEX,
    DECREMENT_QUESTION_INDEX,
    INCREMENT_CHOICE_INDEX,
    DECREMENT_CHOICE_INDEX
} from "./types"

export const clearQuiz = () => {
    return {
        type: CLEAR_QUIZ
    }
}

export const setTitle = title => {
    return {
        type: SET_TITLE,
        payload: {
            title
        }
    }
}

export const addOutcome = outcome => {
    return {
        type: ADD_OUTCOME,
        payload: {
            outcome
        }
    }
}

export const removeOutcome = outcomeId => {
    return {
        type: REMOVE_OUTCOME,
        payload: {
            outcomeId
        }
    }
}

export const setOutcomeOutcome = (outcomeId, outcome) => {
    return {
        type: SET_OUTCOME_OUTCOME,
        payload: {
            outcomeId,
            outcome
        }
    }
}

export const addQuestion = question => {
    return {
        type: ADD_QUESTION,
        payload: {
            question
        }
    }
}

export const removeQuestion = questionId => {
    return {
        type: REMOVE_QUESTION,
        payload: {
            questionId
        }
    }
}

export const setQuestionQuestion = (questionId, questionQuestion) => {
    return {
        type: SET_QUESTION_QUESTION,
        payload: {
            questionId,
            questionQuestion
        }
    }
}

export const addChoice = (questionId, choice) => {
    return {
        type: ADD_CHOICE,
        payload: {
            questionId,
            choice
        }
    }
}

export const removeChoice = (questionId, choiceId) => {
    return {
        type: REMOVE_CHOICE,
        payload: {
            questionId,
            choiceId
        }
    }
}

export const setChoiceChoice = (questionId, choiceId, choiceChoice) => {
    return {
        type: SET_CHOICE_CHOICE,
        payload: {
            questionId,
            choiceId,
            choiceChoice
        }
    }
}

export const setWeight = (questionId, choiceId, outcomeId, weight) => {
    return {
        type: SET_WEIGHT,
        payload: {
            questionId,
            choiceId,
            outcomeId,
            weight
        }
    }
}

export const incrementQuestionIndex = questionId => {
    return {
        type: INCREMENT_QUESTION_INDEX,
        payload: {
            questionId
        }
    }
}

export const decrementQuestionIndex = questionId => {
    return {
        type: DECREMENT_QUESTION_INDEX,
        payload: {
            questionId
        }
    }
}

export const incrementChoiceIndex = (questionId, choiceId) => {
    return {
        type: INCREMENT_CHOICE_INDEX,
        payload: {
            questionId,
            choiceId
        }
    }
}

export const decrementChoiceIndex = (questionId, choiceId) => {
    return {
        type: DECREMENT_CHOICE_INDEX,
        payload: {
            questionId,
            choiceId
        }
    }
}