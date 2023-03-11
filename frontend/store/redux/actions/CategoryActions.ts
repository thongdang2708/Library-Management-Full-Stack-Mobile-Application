
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import { CategoryAction } from "../reducers/CategoryReducer";

//Fetch all categories

export const fetchAllCategories = () => async (dispatch: Dispatch<CategoryAction>, getState : any) => {

    try {

    let response = await axios.get(WEB_URL + "/api/v1/books/all/category");

    let data = response.data;


    dispatch({
        type: "GET_CATEGORIES_SUCCESS",
        payload: data
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        dispatch({
            type: "GET_CATEGORIES_FAIL",
            payload: message
        })
    }

} 