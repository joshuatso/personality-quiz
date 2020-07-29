import {
    SET_TITLE,
    ADD_QUESTION,
    REMOVE_QUESTION,
    ADD_CHOICE,
    REMOVE_CHOICE,
    INCREMENT_QUESTION_INDEX,
    DECREMENT_QUESTION_INDEX,
    INCREMENT_CHOICE_INDEX,
    DECREMENT_CHOICE_INDEX
} from "./types"

export const setTitle = title => {
    return {
        type: SET_TITLE,
        payload: {
            title
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

export const decrementQuestionIndex = (questionId, choiceId) => {
    return {
        type: DECREMENT_CHOICE_INDEX,
        payload: {
            questionId,
            choiceId
        }
    }
}