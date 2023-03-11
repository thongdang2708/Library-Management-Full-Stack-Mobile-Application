
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import {Customer, CustomerAction} from "../reducers/CustomerReducer";

//Get all customers

export const getAllCustomers = (token : string) => async (dispatch: Dispatch<CustomerAction>, getState : any) => {

    try {
    
    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/auth/allCustomers", config);

    let data = response.data;

    let newData : Customer[] = data.map((item : any) => ({
        id: item.id,
        address: item.address,
        city: item.city,
        role: item.role
    }));

    dispatch({
        type: "GET_ALL_CUSTOMERS_SUCCESSFULLY",
        payload: newData
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    }
};

//Delete customer

export const deleteCustomer = (id : number, token : string, message: string) => async (dispatch: Dispatch<CustomerAction>, getState : any) => {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    await axios.delete(WEB_URL + "/auth/deleteCustomer/customer/" + id, config);

    dispatch({
        type: "DELETE_CUSTOMER_SUCCESSFULLY",
        payload: {
            id: id,
            message: message
        }
    });

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    }
};

//Reset function for managing customer page

export const resetFunctionForManagingCustomer = () => async (dispatch: Dispatch<CustomerAction>, getState : any) => {

    dispatch({
        type: "RESET_FUNCTION"
    })
}