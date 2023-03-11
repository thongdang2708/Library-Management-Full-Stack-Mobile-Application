
export interface Quiz {
    id: number,
    question: string,
    answer: string,
    status: string,
    customerId: number | null,
    adminId: number | null
};

interface InitialState {
    quizzes: Quiz[] | [],
    quiz: Quiz | {},
    isSuccess: boolean,
    isError: boolean,
    message: string
}

let initialState : InitialState = {
    quizzes: [],
    quiz: {},
    isSuccess: false,
    isError: false,
    message: ""
};

export interface QuizAction {
    type: string,
    payload?: any
}

export const questionReducers = (state : InitialState = initialState, action : QuizAction) => {
    switch (action.type) {

        case "FETCH_ALL_QUIZZES_SUCCESSFULLY":
            return {
                ...state,
                quizzes: action.payload
            }
        case "ADD_QUIZ_SUCCESSFULLY":
            return {
                ...state,
                quizzes: [...state.quizzes as Quiz[], action.payload.quiz],
                isSuccess: true,
                message: action.payload.message
            }
        case "CASE_FAIL":
            return {
                ...state,
                isError: true,
                message: action.payload
            }
        default:
            return state
    }
}

