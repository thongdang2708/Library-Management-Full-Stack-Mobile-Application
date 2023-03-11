
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import { HistoryAction, History} from "../reducers/HistoryReducer";

//Display all histories

export const fetchAllHistories = (id: number, token : string) => async (dispatch: Dispatch<HistoryAction>, getState : any) => {

    try {

    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
            
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
            
    let preData = preResponse.data;

    let response = await axios.get(WEB_URL + "/api/v1/history/all/customer/" + preData.id, commonConfig);

    let data = response.data;

    let newArrayData = data.map((item : any) => ({
        id: item.id,
        bookName: item.bookName,
        borrowDate: item.borrowDate,
        returnDate: item.returnDate
    }));

    dispatch({
        type: "GET_HISTORIES",
        payload: newArrayData
    });
    
    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
     dispatch({
            type: "CASE_FAIL",
            payload: message
        })
    }
};

//Add history after returning

export const addHistory = (checkoutId: number, bookId: number, customerId: number, token : string) => async (dispatch: Dispatch<HistoryAction>, getState : any) => {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.post(WEB_URL + "/api/v1/history/checkout/" + checkoutId + "/book/" + bookId + "/customer/" + customerId, {}, config);

    let data = response.data;

    let newData : History = {
        id: data.id,
        bookName: data.bookName,
        borrowDate: data.borrowDate,
        returnDate: data.returnDate
    };


    dispatch({
        type: "ADD_HISTORY",
        payload: newData
    });

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        })
    }
}  