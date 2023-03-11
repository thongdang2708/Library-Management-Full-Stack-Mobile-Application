
export interface Comment {
    id: number,
    description: string,
    grade: number,
    userIdForReview: number,
    username: string
}

interface InitialState {
    comments: Comment[] | [],
    isCommented: boolean | undefined,
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialState : InitialState = {
    comments: [],
    isCommented: undefined,
    isSuccess: false,
    isError: false,
    message: ""
}

export interface CommentAction {
    type: string,
    payload?: any
}

export const commentReducers = (state : InitialState = initialState, action: CommentAction) => {
    switch (action.type) {


        case "CHECK_REVIEW_SUCCESSFULLY":
            return {
                ...state,
                isCommented: action.payload
            }
        case "GET_REVIEWS_SUCCESSFULLY":
            return {
                ...state,
                comments: action.payload
            }
        case "ADD_COMMENT_SUCCESSFULLY":
            return {
                ...state,
                comments: [...state.comments as Comment[], action.payload],
                isSuccess: true,
                isError: false,
                message: ""
            }
        case "DELETE_COMMENT_SUCCESSFULLY":
            return {
                ...state,
                comments: state.comments.filter((comment : Comment) => comment.id !== action.payload)
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