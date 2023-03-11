
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import { CommentAction, Comment } from "../reducers/CommentReducer";

export interface InputComment {
    description: string,
    grade: number
}


//Fetch all comments 

export const fetchAllComments = (bookId: number) => async (dispatch: Dispatch<CommentAction>, getState : any) =>  {

    try {

    let response = await axios.get(WEB_URL + "/api/v1/reviews/all/book/" + bookId);

    let data = response.data;


    let newData = data.map((item : any) => ({
        id: item.review.id,
        description: item.review.description,
        grade: item.review.grade,
        userIdForReview: item.userForReview.id,
        username: item.userForReview.username
    }));

    dispatch({
        type: "GET_REVIEWS_SUCCESSFULLY",
        payload: newData
    });


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    }
}



//Check is commented by a customer function

export const checkReview = (id: number, bookId: number, token : string) => async (dispatch: Dispatch<CommentAction>, getState : any) => {

    try {
    
    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
    
    let preData = preResponse.data;

    let response = await axios.get(WEB_URL + "/api/v1/reviews/check/book/" + bookId + "/customer/" + preData.id, commonConfig);

    let data = response.data;

    dispatch({
        type: "CHECK_REVIEW_SUCCESSFULLY",
        payload: data.condition
    });
    


    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    };
}

//Function to add comment

export const addComment = (id: number, bookId: number, token: string, input : InputComment) => async (dispatch: Dispatch<CommentAction>, getState : any) => {

    try {
    
    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
        
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
        
    let preData = preResponse.data;

    let response = await axios.post(WEB_URL + "/api/v1/reviews/customer/" + preData.id + "/book/" + bookId, input, commonConfig);

    let data = response.data;

    let newData : Comment = {
        id: data.review.id,
        description: data.review.description,
        grade: data.review.grade,
        userIdForReview: data.userForReview.id,
        username: data.userForReview.username
    };

    dispatch({
        type: "ADD_COMMENT_SUCCESSFULLY",
        payload: newData
    });
    
    dispatch({
        type: "CHECK_REVIEW_SUCCESSFULLY",
        payload: true
    });

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    };

};

//Handle delete

export const deleteReview = (token : string, id : number) => async (dispatch: Dispatch<CommentAction>, getState : any) => {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    await axios.delete(WEB_URL + "/api/v1/reviews/" + id, config);

    dispatch({
        type: "DELETE_COMMENT_SUCCESSFULLY",
        payload: id
    });
    

    } catch (error : any) {
        let message = error.response.data.messages[0].toString();

        
        dispatch({
               type: "CASE_FAIL",
               payload: message
        });
    
    }
};