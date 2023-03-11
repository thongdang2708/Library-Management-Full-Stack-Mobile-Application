

import axios from "axios";
import { Dispatch } from "redux";
import { UserActions } from "../reducers/UserReducer";
import { WEB_URL } from "@env";

//Check admin function

export const checkAdminFunction = (id : number, token : String) => async (dispatch: Dispatch<UserActions>, getState : any) => {

    try {

        let config = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        };
    
        let response = await axios.get(WEB_URL + "/auth/checkIsAdmin/" + id, config);

        let data = response.data;

        if (data.condition) {
            dispatch({
                type: "CHECK_ADMIN_SUCCESS_TRUE"
            })
        } else {
            dispatch({
                type: "CHECK_ADMIN_SUCCESS_FALSE"
            });
        }


    } catch (error : any) {

        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "CHECK_ADMIN_FAIL",
            payload: message
        })
    }

   
    
}; 

//Log out function 

export const logoutFunction = () => async (dispatch: Dispatch<UserActions>, getState : any) => {

    dispatch({
        type: "LOG_OUT"
    })
}

