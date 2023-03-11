
import axios from "axios";
import { WEB_URL } from "@env";
import { Dispatch } from "redux";
import {Quiz, QuizAction} from "../reducers/QuestionReducer";

//Fetch all quizzes

export const fetchAllQuizzes = (token : string) => async (dispatch: Dispatch<QuizAction>, getState : any) => {

    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/quiz/all", config);

    let data = response.data;


    let newData : QuizAction[] = data.map((item : any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        status: item.status,
        customerId: item.customer.id,
        adminId: item.admin == null ? null : item.admin?.id
    }));

    dispatch({
        type: "FETCH_ALL_QUIZZES_SUCCESSFULLY",
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

export interface QuestionInput {
    question: string
}

//Function to add question

export const addQuestionFunction = (id: number, token: string, input : QuestionInput, message : string) => async (dispatch: Dispatch<QuizAction>, getState : any) => {

    try {

    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    
    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getCustomer", commonConfig);
    
    let preData = preResponse.data;

    let response = await axios.post(WEB_URL + "/api/v1/quiz/addQuestion/customer/" + preData.id, input, commonConfig);

    let data = response.data;

    let newData : Quiz = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        status: data.status,
        customerId: data.customer.id,
        adminId: data.admin == null ? null : data.admin?.id
    };

    dispatch({
        type: "ADD_QUIZ_SUCCESSFULLY",
        payload: {
            quiz: newData,
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

//Fetch all unanswered quiz

export const fetchAllUnansweredQuizzes = (token : string) => async (dispatch: Dispatch<QuizAction>, getState : any) => {
    
    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/quiz/unansweredQuiz", config);

    let data = response.data;

    let newData : Quiz[] = data.map((item : any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        status: item.status,
        customerId: item.customer.id,
        adminId: item.admin == null ? null : item.admin?.id
    }));
    
    dispatch({
        type: "FETCH_ALL_QUIZZES_SUCCESSFULLY",
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

//Fetch all answered questions

export const fetchAllAnsweredQuizzes = (token : string) => async (dispatch: Dispatch<QuizAction>, getState : any) => {
    
    try {

    let config = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let response = await axios.get(WEB_URL + "/api/v1/quiz/answeredQuiz", config);

    let data = response.data;

    let newData : Quiz[] = data.map((item : any) => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
        status: item.status,
        customerId: item.customer.id,
        adminId: item.admin == null ? null : item.admin?.id
    }));
    
    dispatch({
        type: "FETCH_ALL_QUIZZES_SUCCESSFULLY",
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

export interface AnswerInput {
    answer: string
}

// Add answer to customer

export const addAnswerFunction = (quizId: number, id: number, token: string, input: AnswerInput) => async (dispatch: Dispatch<QuizAction>, getState : any) => {

    try {
    
    let commonConfig = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let preResponse = await axios.get(WEB_URL + "/auth/" + id + "/getAdmin", commonConfig);

    let preData = preResponse.data;

    let response = await axios.post(WEB_URL + "/api/v1/quiz/" + quizId + "/addAnswer/admin/" + preData.id, input, commonConfig);

    let data = response.data;

    let newData : Quiz = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        status: data.status,
        customerId: data.customer.id,
        adminId: data.admin == null ? null : data.admin?.id
    };

    let totalQuizzes = getState().quiz.quizzes;

    let newTotalQuizzes : Quiz[] = totalQuizzes.filter((quiz : Quiz) => quiz.id !== newData.id);

    dispatch({
        type: "FETCH_ALL_QUIZZES_SUCCESSFULLY",
        payload: newTotalQuizzes
    });


    } catch (error : any) { 
        let message = error.response.data.messages[0].toString();

        
        dispatch({
            type: "CASE_FAIL",
            payload: message
        });
    }

}
