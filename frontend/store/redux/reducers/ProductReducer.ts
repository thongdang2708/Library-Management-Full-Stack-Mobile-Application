
import { page_size } from "@env";


//Set page size
let pageSize = parseInt(page_size);

export interface Book {
    id: number,
    name: string,
    author: string,
    categoryType: string,
    borrowLength: number,
    urlImage: string,
    quantity: number,
    availableQuantity: number,
    createdAt: string
}

interface InitialStateProps {
    paginatedBooks: Book[] | [],
    book: Book | {},
    books: Book[] | [],
    isSuccess: boolean,
    isError: boolean,
    message: string
}

const initialValues : InitialStateProps = {
    paginatedBooks: [],
    book: {},
    books: [],
    isSuccess: false,
    isError: false,
    message: ""
}

export interface BookActions {
    type: string,
    payload?: any
}

export const bookReducers = (state: InitialStateProps = initialValues, action: BookActions) => {

    switch (action.type) {
        case "ADD_BOOK_SUCCESSFULLY":
            return {
                ...state,
                books: [...state.books, action.payload],
                paginatedBooks: state.paginatedBooks.length < pageSize ? [...state.paginatedBooks as Book[], action.payload] : state.paginatedBooks,
                isSuccess: true,
                isError: false,
                message: ""
            }
        case "ADD_BOOK_FAIL":
                return {
                    ...state,
                    isError: true,
                    message: action.payload
                }
        case "RESET_AFTER_ADDING":
                return {
                    ...state,
                    isSuccess: false,
                    isError: false,
                    message: ""
                }
        case "GET_ALL_BOOKS_SUCCESS":
                return {
                    ...state,
                    books: action.payload,
                    isSuccess: true,
                    isError: false,
                    message: ""
                }
        case "GET_ALL_BOOKS_PAGINATION_SUCCESS":
                return {
                    ...state,
                    paginatedBooks: action.payload,
                    isSuccess: true,
                    isError: false,
                    messsage: ""
                }
        case "GET_SINGLE_BOOK_SUCCESS":
                return {
                    ...state,
                    book: action.payload,
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


