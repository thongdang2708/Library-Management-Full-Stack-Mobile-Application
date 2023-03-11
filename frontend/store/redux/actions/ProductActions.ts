
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import { Book, BookActions } from "../reducers/ProductReducer";


//Add book
export const addBook = (id : number, token : string, formData : FormData) => async (dispatch: Dispatch<BookActions>, getState: any) => {

    try {
    
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
        }
    };

    let secondConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getAdmin", secondConfig);

    let preData = preResponse.data;

    let response = await axios.post(WEB_URL + "/api/v1/books/admin/" + preData.id, formData, config);

    let data = response.data;

    let newBook : Book = {
        id: data.id,
        name: data.name,
        author: data.author,
        categoryType: data.categoryType,
        borrowLength: data.borrowLength,
        urlImage: data.urlImage,
        quantity: data.quantity,
        availableQuantity: data.availableQuantity,
        createdAt: data.createdAt
    };
    

    dispatch({
        type: "ADD_BOOK_SUCCESSFULLY",
        payload: newBook
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "ADD_BOOK_FAIL",
            payload: message
        })
    }
}



//Reset function

export const resetFunction = () => async (dispatch: Dispatch<BookActions>, getState : any) => {

    dispatch({
        type: "RESET_AFTER_ADDING"
    })
}

//Fetch all books

export const getAllBooks = () => async (dispatch: Dispatch<BookActions> , getState : any) => {

    try {
    
    let response = await axios.get(WEB_URL + "/api/v1/books/allBooks");

    let data = response.data;
    
    let mappedBooks = data.map((item : any) => ({
        id: item.id,
        name: item.name,
        author: item.author,
        categoryType: item.categoryType,
        borrowLength: item.borrowLength,
        urlImage: item.urlImage,
        quantity: item.quantity,
        availableQuantity: item.availableQuantity,
        createdAt: item.createdAt
    }))


    dispatch({
        type: "GET_ALL_BOOKS_SUCCESS",
        payload: mappedBooks
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })

    }
}


//Get pagination for books based on keywords

export const getAllBookOnFilter = (offset: number, pageSize: number, category: string) => async (dispatch: Dispatch<BookActions>, getState : any) => {

    try {

        let response = await axios.get(WEB_URL + "/api/v1/books/filter/category/" + category + "/offset/" + offset + "/pageSize/" + pageSize);

        let data = response.data;
    
        let mappedBooks = data.map((item : any) => ({
            id: item.id,
            name: item.name,
            author: item.author,
            categoryType: item.categoryType,
            borrowLength: item.borrowLength,
            urlImage: item.urlImage,
            quantity: item.quantity,
            availableQuantity: item.availableQuantity,
            createdAt: item.createdAt
        }))

        console.log(getState().book.books.length);
      

        let totalBooks = getState().book.books.filter((item: Book) => {
            mappedBooks.forEach((minorItem : any) => {
                if (item.id == minorItem.id) {
                    return true;
                }
            })
            return false;
        });


        console.log(totalBooks.length);
       


        dispatch({
            type: "GET_ALL_BOOKS_SUCCESS",
            payload: totalBooks
        });
    
    
    
        dispatch({
            type: "GET_ALL_BOOKS_PAGINATION_SUCCESS",
            payload: mappedBooks
        });



    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}


//Get pagination for books based on keywords

export const getAllBookOnKeywords = (offset: number, pageSize: number, keyword: string) => async (dispatch: Dispatch<BookActions>, getState : any) => {

    try {

        let response = await axios.get(WEB_URL + "/api/v1/books/search/" + keyword + "/offset/" + offset + "/pageSize/" + pageSize);

        let data = response.data;
    
        let mappedBooks = data.map((item : any) => ({
            id: item.id,
            name: item.name,
            author: item.author,
            categoryType: item.categoryType,
            borrowLength: item.borrowLength,
            urlImage: item.urlImage,
            quantity: item.quantity,
            availableQuantity: item.availableQuantity,
            createdAt: item.createdAt
        }));

        let totalBooks = getState().book.books.filter((item: Book) => {
            mappedBooks.forEach((minorItem : any) => {
                if (item.id == minorItem.id) {
                    return true;
                }
            })
            return false;
        });


        dispatch({
            type: "GET_ALL_BOOKS_SUCCESS",
            payload: totalBooks
        });
    
    
    
        dispatch({
            type: "GET_ALL_BOOKS_PAGINATION_SUCCESS",
            payload: mappedBooks
        });



    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}


//Get pagination for all books
export const getAllPaginationBooks = (offset: number, pageSize: number) => async (dispatch: Dispatch<BookActions>, getState : any) => {

    try {

    let response = await axios.get(WEB_URL + "/api/v1/books/pagination/" + offset + "/" + pageSize);

    let data = response.data;

    let mappedBooks = data.map((item : any) => ({
        id: item.id,
        name: item.name,
        author: item.author,
        categoryType: item.categoryType,
        borrowLength: item.borrowLength,
        urlImage: item.urlImage,
        quantity: item.quantity,
        availableQuantity: item.availableQuantity,
        createdAt: item.createdAt
    }))


    dispatch({
        type: "GET_ALL_BOOKS_PAGINATION_SUCCESS",
        payload: mappedBooks
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })

    }
};

//Function to fetch single book

export const getSingleBook = (id : number) => async (dispatch: Dispatch<BookActions>, getState: any) => {

    try {

    
    let response = await axios.get(WEB_URL + "/api/v1/books/" + id);

    let data = response.data;

    let newData : Book = {
        id: data.id,
        name: data.name,
        author: data.author,
        categoryType: data.categoryType,
        borrowLength: data.borrowLength,
        urlImage: data.urlImage,
        quantity: data.quantity,
        availableQuantity: data.availableQuantity,
        createdAt: data.createdAt
    };

    dispatch({
        type: "GET_SINGLE_BOOK_SUCCESS",
        payload: newData
    })

    } catch (error: any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}

//Handle increase book quantity

export const handleIncreaseBook = (id: number, token : string) => async (dispatch: Dispatch<BookActions>, getState : any) => {

    try {
    
        let config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
    
        let response = await axios.put(WEB_URL + "/api/v1/books/" + id + "/increaseQuantity", {}, config);
    
        let data = response.data;

        console.log(data);
    
        let newData : Book = {
            id: data.id,
            name: data.name,
            author: data.author,
            categoryType: data.categoryType,
            borrowLength: data.borrowLength,
            urlImage: data.urlImage,
            quantity: data.quantity,
            availableQuantity: data.availableQuantity,
            createdAt: data.createdAt
        };

        let totalBooks = getState().book.books;
        let totalPaginatedBooks = getState().book.paginatedBooks;

        let newTotalBooks = totalBooks.map((item : Book) => {
            if (item.id === newData.id) {
                item.quantity = newData.quantity;
                item.availableQuantity = newData.availableQuantity
            }

            return {
                ...item,
                quantity: item.quantity,
                availableQuantity: item.availableQuantity
            }
        });

        let newTotalPaginatedBooks = totalPaginatedBooks.map((item: Book) => {
            if (item.id === newData.id) {
                item.quantity = newData.quantity;
                item.availableQuantity = newData.availableQuantity
            }

            return {
                ...item,
                quantity: item.quantity,
                availableQuantity: item.availableQuantity
            }
        });

        dispatch({
            type: "GET_ALL_BOOKS_SUCCESS",
            payload: newTotalBooks
        });
    
    
    
        dispatch({
            type: "GET_ALL_BOOKS_PAGINATION_SUCCESS",
            payload: newTotalPaginatedBooks
        });
    
        dispatch({
            type: "GET_SINGLE_BOOK_SUCCESS",
            payload: newData
        })
    

    } catch (error: any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}

//Handle increase book quantity

export const handleDecreaseBook = (id: number, token : string) => async (dispatch: Dispatch<BookActions>, getState : any) => {

    try {
    
        let config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
    
        let response = await axios.put(WEB_URL + "/api/v1/books/" + id + "/decreaseQuantity", {}, config);
    
        let data = response.data;

        console.log(data);
    
        let newData : Book = {
            id: data.id,
            name: data.name,
            author: data.author,
            categoryType: data.categoryType,
            borrowLength: data.borrowLength,
            urlImage: data.urlImage,
            quantity: data.quantity,
            availableQuantity: data.availableQuantity,
            createdAt: data.createdAt
        };

        let totalBooks = getState().book.books;
        let totalPaginatedBooks = getState().book.paginatedBooks;

        let newTotalBooks = totalBooks.map((item : Book) => {
            if (item.id === newData.id) {
                item.quantity = newData.quantity;
                item.availableQuantity = newData.availableQuantity
            }

            return {
                ...item,
                quantity: item.quantity,
                availableQuantity: item.availableQuantity
            }
        });

        let newTotalPaginatedBooks = totalPaginatedBooks.map((item: Book) => {
            if (item.id === newData.id) {
                item.quantity = newData.quantity;
                item.availableQuantity = newData.availableQuantity
            }

            return {
                ...item,
                quantity: item.quantity,
                availableQuantity: item.availableQuantity
            }
        });

        dispatch({
            type: "GET_ALL_BOOKS_SUCCESS",
            payload: newTotalBooks
        });
    
    
    
        dispatch({
            type: "GET_ALL_BOOKS_PAGINATION_SUCCESS",
            payload: newTotalPaginatedBooks
        });
    
        dispatch({
            type: "GET_SINGLE_BOOK_SUCCESS",
            payload: newData
        })
    

    } catch (error: any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}