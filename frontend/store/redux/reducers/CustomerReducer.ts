
export interface Customer {
    id: number,
    address: string | null,
    city: string | null
    role: string
}

interface InitialState {
    customers: Customer[] | [],
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialState : InitialState = {
    customers: [],
    isSuccess: false,
    isError: false,
    message: ""
};

export interface CustomerAction {
    type: string,
    payload?: any
}

export const customerReducers = (state : InitialState = initialState, action : CustomerAction) => {

    switch (action.type) {

        case "GET_ALL_CUSTOMERS_SUCCESSFULLY":
            return {
                ...state,
                customers: action.payload,
                isError: false,
                message: ""
            }
        case "DELETE_CUSTOMER_SUCCESSFULLY":
            return {
                ...state,
                customers: state.customers.filter((customer : Customer) => customer.id !== action.payload.id),
                isSuccess: true,
                message: action.payload.message
            }
        case "RESET_FUNCTION":
            return {
                ...state,
                isSuccess: false,
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