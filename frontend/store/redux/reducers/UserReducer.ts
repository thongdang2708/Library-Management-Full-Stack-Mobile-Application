
export interface UserState {
    id: number, 
    username: string,
    isAdmin: boolean | undefined,
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialState : UserState = {
    id: 0,
    username: "",
    isAdmin: undefined,
    isSuccess: false,
    isError: false,
    message: ""
}

export interface UserActions {
    type: string,
    payload?: any
}

export const userReducers = (state : UserState = initialState, action : UserActions) => {

    switch (action.type) {
        case "CHECK_ADMIN_SUCCESS_TRUE":
            return {
                ...state,
                isAdmin: true,
                isSuccess: true
            }
        case "CHECK_ADMIN_SUCCESS_FALSE":
            return {
                ...state,
                isAdmin: false,
                isSuccess: true
            }
        case "CHECK_ADMIN_FAIL":
            return {
                ...state,
                isError: true,
                message: action.payload
            }
        case "LOG_OUT":
            return {
                ...state,
                id: 0,
                username: "",
                isAdmin: undefined,
                isSuccess: false,
                isError: false,
                message: ""
            }
        default:
            return state
    }
}