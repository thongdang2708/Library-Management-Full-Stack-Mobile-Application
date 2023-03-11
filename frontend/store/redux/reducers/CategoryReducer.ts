


interface CategoryState {
    category: string[] | [],
    isSuccess: boolean,
    isError: boolean,
    message: string
};



const initialState : CategoryState = {
    category: [],
    isSuccess: false,
    isError: false,
    message: ""
}

export interface CategoryAction {
    type: string,
    payload?: any
}

export const categoryReducers = (state : CategoryState = initialState, action :CategoryAction) => {

    switch (action.type) {
        case "GET_CATEGORIES_SUCCESS":
            return {
                ...state,
                category: action.payload,
                isSuccess: true
            }
        case "GET_CATEGORIES_FAIL":
            return {
                ...state,
                isError: true,
                message: action.payload
            }
        default:
            return state
    }
}