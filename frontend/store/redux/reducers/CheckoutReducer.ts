

export interface Checkout {
    id: number,
    bookName: string,
    borrowDate: string,
    dateToReturn: string,
    returnDate: string | null,
    isReturned: boolean,
    bookId: number,
    bookQuantity: number,
    bookAvailableQuantity: number,
    customerId: number,
}

interface InitialState {
    checkouts: Checkout[] | [],
    checkout: Checkout | {},
    numberOfCheckouts: number,
    maxCheckouts: number
    isBorrowed: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialState : InitialState = {
    checkouts: [],
    checkout: {},
    numberOfCheckouts: 0,
    maxCheckouts: 0,
    isBorrowed: false,
    isSuccess: false,
    isError: false,
    message: ""
}

export interface CheckoutAction {
    type: string,
    payload?: any
}

export const checkoutReducers = (state: InitialState = initialState, action: CheckoutAction) => {

    switch (action.type) {

        case "ADD_CHECKOUT_SUCCESS":
            return {
                ...state,
                checkout: action.payload,
                isSuccess: true
            }
        case "CHECK_BOOK_IS_BORROWED":
            return {
                ...state,
                isBorrowed: action.payload,
                isError: false,
                message: ""
            }
        case "DISPLAY_COUNT_CHECKOUT":
            return {
                ...state,
                numberOfCheckouts: action.payload.numberOfCheckouts > action.payload.maxCheckouts ? action.payload.maxCheckouts : action.payload.numberOfCheckouts,
                maxCheckouts: action.payload.maxCheckouts
            }
        case "INCREASE_COUNT":
            return {
                ...state,
                numberOfCheckouts: action.payload > state.maxCheckouts ? state.maxCheckouts : action.payload
            }
        case "CASE_FAIL":
            return {
                ...state,
                isError: true,
                message: action.payload
            }
        case "RESET_AFTER_BORROW":
            return {
                ...state,
                isSuccess: false,
                isError: false,
                message: ""
        }
        case "SET_EXTENDED_SUCCESSFULLY":
            return {
                ...state,
                isSuccess: true,
                message: action.payload
            }
        case "RETURN_BOOK_SUCCESSFULLY":
            return {
                ...state,
                isSuccess: true,
                message: action.payload
            }
        case "GET_ALL_CHECKOUTS":
            return {
                ...state,
                checkouts: action.payload,
                isError: false,
                message: ""
            }
        default:
            return state
    }
}