
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import { CheckoutAction } from "../reducers/CheckoutReducer";
import { Book } from "../reducers/ProductReducer";
import { Checkout } from "../reducers/CheckoutReducer";

// id: number,
// name: string,
// author: string,
// categoryType: string,
// borrowLength: number,
// urlImage: string,
// quantity: number,
// availableQuantity: number,
// createdAt: string

//Check out book

export const checkoutBook = (id: number, bookId: number, token: string) => async (dispatch: Dispatch<CheckoutAction>, getState: any) => {

    try {

    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);

    let preData = preResponse.data;

    let response = await axios.post(WEB_URL + "/api/v1/checkout/book/" + bookId + "/customer/" + preData.id, {}, commonConfig);
    
    let data = response.data;

    let newData : Checkout = {
        id: data.id,
        bookName: data.bookName,
        borrowDate: data.borrowDate,
        dateToReturn: data.dateToReturn,
        returnDate: data.returnDate,
        isReturned: data.isReturned,
        bookId: data.book.id,
        bookQuantity: data.book.quantity,
        bookAvailableQuantity: data.book.availableQuantity,
        customerId: data.customer.id
    };

  

    let totalBooks = getState().book.books;
    let totalPaginatedBooks = getState().book.paginatedBooks;
    let singleBook = getState().book.book;


    let newBook : Book = {
        id: singleBook.id,
        name: singleBook.name,
        author: singleBook.author,
        categoryType: singleBook.categoryType,
        borrowLength: singleBook.borrowLength,
        urlImage: singleBook.urlImage,
        quantity: newData.bookQuantity,
        availableQuantity: newData.bookAvailableQuantity,
        createdAt: singleBook.createdAt
    };

    let newTotalBooks = totalBooks.map((item : Book) => {
        if (item.id === newBook.id) {
            item.quantity = newBook.quantity;
            item.availableQuantity = newBook.availableQuantity
        }

        return {
            ...item,
            quantity: item.quantity,
            availableQuantity: item.availableQuantity
        }
    });

    let newTotalPaginatedBooks = totalPaginatedBooks.map((item: Book) => {
        if (item.id === newBook.id) {
            item.quantity = newBook.quantity;
            item.availableQuantity = newBook.availableQuantity
        }

        return {
            ...item,
            quantity: item.quantity,
            availableQuantity: item.availableQuantity
        }
    });

    let count = getState().checkout.numberOfCheckouts;
    count++;
    let maxCount = getState().checkout.maxCheckouts;

    dispatch({
        type: "INCREASE_COUNT",
        payload: count > maxCount ? maxCount : count
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
        payload: newBook
    });

    dispatch({
        type: "ADD_CHECKOUT_SUCCESS",
        payload: newData
    });

    dispatch({
        type: "CHECK_BOOK_IS_BORROWED",
        payload: true
    });

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}

//Check book is borrowed

export const checkBookIsBorrowed = (id: number, bookId: number, token: string) => async (dispatch: Dispatch<CheckoutAction>, getState: any) => {

    try {

    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);

    let preData = preResponse.data;


    let response = await axios.get(WEB_URL + "/api/v1/checkout/checkIsBorrowed/book/" + bookId + "/customer/" + preData.id, commonConfig);

    let data = response.data;

   

    dispatch({
        type: "CHECK_BOOK_IS_BORROWED",
        payload: data.condition as boolean
    });

    } catch (error : any) {

        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
}

//Reset after borrowing

export const resetAfterBorrowing = () => async (dispatch: Dispatch<CheckoutAction>, getState : any) => {

    try {

    dispatch({
        type: "RESET_AFTER_BORROW"
    });

    } catch (error: any) {

        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
};


//Fetch count for checkout

export const fetchCount = (id : number, token : string) => async (dispatch: Dispatch<CheckoutAction>, getState : any) => {

    try {
    
    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
    
    let preData = preResponse.data;
    
    let response = await axios.get(WEB_URL + "/api/v1/checkout/all/customer/" + preData.id, commonConfig);

    let data = response.data;

    dispatch({
        type: "DISPLAY_COUNT_CHECKOUT",
        payload: {
            numberOfCheckouts: data.numberOfCheckouts,
            maxCheckouts: data.maxCheckouts
        }
    });


    } catch (error : any) {

    let message = error.response.data.messages[0].toString();

        
    dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
};

//Fetch all loans by customer

export const fetchAllCheckouts = (id : number, token : string) => async (dispatch: Dispatch<CheckoutAction>, getState : any) => {

    
    try {
    
    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
        
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
        
    let preData = preResponse.data;

    let response = await axios.get(WEB_URL + "/api/v1/checkout/getAllCheckout/customer/" + preData.id, commonConfig);

    let data = response.data;

    let newArrayData : Checkout[] = data.map((item : any) => ({
        id: item.id,
        bookName: item.bookName,
        borrowDate: item.borrowDate,
        dateToReturn: item.dateToReturn,
        returnDate: item.returnDate,
        isReturned: item.isReturned,
        bookId: item.book.id,
        bookQuantity: item.book.quantity,
        bookAvailableQuantity: item.book.availableQuantity,
        customerId: item.customer.id
    }));

    dispatch({
        type: "GET_ALL_CHECKOUTS",
        payload: newArrayData
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
     dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }


}

//Check return on time 

export const checkReturnOnTime = async (checkoutId: number, bookId: number, customerId: number, token: string) => {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/checkout/" + checkoutId + "/checkReturnOnTime/book/" + bookId + "/customer/" + customerId, config);

    let data = response.data;

    return data;
};

//Set extended loan for book

export const setExtendedLoanForBook = (checkoutId: number,bookId: number, customerId: number, token: string, message : string) =>  async (dispatch: Dispatch<CheckoutAction>, getState : any) => {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/checkout/" + checkoutId + "/setExtended/book/" + bookId + "/customer/" + customerId, config);

    let data = response.data;

    let newData : Checkout = {
        id: data.id,
        bookName: data.bookName,
        borrowDate: data.borrowDate,
        dateToReturn: data.dateToReturn,
        returnDate: data.returnDate,
        isReturned: data.isReturned,
        bookId: data.book.id,
        bookQuantity: data.book.quantity,
        bookAvailableQuantity: data.book.availableQuantity,
        customerId: data.customer.id
    };

    let totalCheckouts = getState().checkout.checkouts;

    let newTotalCheckouts = totalCheckouts.map((item : Checkout) => {

        if(item.id === newData.id) {
            item.borrowDate = newData.borrowDate;
            item.dateToReturn = newData.dateToReturn;
            item.returnDate = newData.returnDate;
            item.isReturned = newData.isReturned;
        }

        return {
            ...item,
            borrowDate: item.borrowDate,
            dateToReturn: item.dateToReturn,
            returnDate: item.returnDate,
            isReturned: item.isReturned
        }
    });


    dispatch({
        type: "GET_ALL_CHECKOUTS",
        payload: newTotalCheckouts
    });

    dispatch({
        type: "SET_EXTENDED_SUCCESSFULLY",
        payload: message
    });

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        })
    }
}

// Function to return book

export const returnBook = (checkoutId: number, bookId : number, customerId: number, token : string, message: string) => async (dispatch: Dispatch<CheckoutAction>, getState : any) =>  {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/checkout/" + checkoutId + "/returnBook/book/" + bookId + "/customer/" + customerId, config);

    let data = response.data;

    let newData : Checkout = {
        id: data.id,
        bookName: data.bookName,
        borrowDate: data.borrowDate,
        dateToReturn: data.dateToReturn,
        returnDate: data.returnDate,
        isReturned: data.isReturned,
        bookId: data.book.id,
        bookQuantity: data.book.quantity,
        bookAvailableQuantity: data.book.availableQuantity,
        customerId: data.customer.id
    };

    let totalCheckouts = getState().checkout.checkouts;

    let newTotalCheckouts = totalCheckouts.map((item : Checkout) => {

        if(item.id === newData.id) {
            item.borrowDate = newData.borrowDate;
            item.dateToReturn = newData.dateToReturn;
            item.returnDate = newData.returnDate;
            item.isReturned = newData.isReturned;
        }

        return {
            ...item,
            borrowDate: item.borrowDate,
            dateToReturn: item.dateToReturn,
            returnDate: item.returnDate,
            isReturned: item.isReturned
        }
    });


    dispatch({
        type: "GET_ALL_CHECKOUTS",
        payload: newTotalCheckouts
    });

    dispatch({
        type: "RETURN_BOOK_SUCCESSFULLY",
        payload: message
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        })
    }
}

