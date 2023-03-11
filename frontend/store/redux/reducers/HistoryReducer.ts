
export interface History {
    id: number,
    bookName: string,
    borrowDate: string,
    returnDate: string
}

interface InitialState {
    histories: History[] | [],
    history: History | {},
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialState : InitialState = {
    histories: [],
    history: {},
    isSuccess: false,
    isError: false,
    message: ""
};

export interface HistoryAction {
    type: string,
    payload?: any
}

export const historyReducers = (state: InitialState = initialState, action: HistoryAction) => {

    switch (action.type) {
        
        case "GET_HISTORIES":
            return {
                ...state,
                histories: action.payload,
                isSuccess: true,
                isError: false,
                message: ""
            }
        case "ADD_HISTORY":
            return {
                ...state,
                histories: [...state.histories, action.payload],
                isSuccess: true,
                isError: false,
                message: ""
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
