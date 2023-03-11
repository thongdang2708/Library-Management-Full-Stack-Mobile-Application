import { useReducer } from "react";
import { useState } from "react";
import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { WEB_URL } from "@env";

//Set interface for children props
interface ChildrenProps {
    children: React.ReactNode
}

//Set interface for auth props
interface AuthContext {
    token: string | undefined | null,
    id: number | null | undefined,
    refreshToken: string | null | undefined,
    isAdmin: Boolean,
    isAuthenticated: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: "",
    saveSuccessAlert: (message? : string) => void,
    saveFailAlert: (message : string) => void,
    updateToken: (refreshToken : string, id : number) => void,
    removeError: () => void,
    logIn: (userInfo : TokenProps) => void,
    logOut: () => void,
}

//Set initial values for Auth Context
let initialAuthValues : AuthContext = {
    token: "",
    id: undefined,
    refreshToken: "",
    isAdmin: false,
    isAuthenticated: false,
    isSuccess: false,
    isError: false,
    message: "",
    saveSuccessAlert: (message? : string) => {},
    saveFailAlert: (message : string) => {},
    updateToken: (refreshToken : string, id : number) => {},
    removeError: () => {},
    logIn: (userInfo : TokenProps) => {},
    logOut: () => {},
};

let AuthContext = createContext<AuthContext>(initialAuthValues);

//Set interface for action

interface Action {
    type: string,
    payload?: any
}

const authReducer = (state : AuthContext = initialAuthValues, action: Action) => {

    switch (action.type) {
        case "LOG_IN_SUCCESS":
            return {
                ...state,
                isSuccess: true,
                message: action.payload
            }
        case "LOG_IN_FAIL":
            return {
                ...state,
                isError: true,
                message: action.payload
            }
        case "RESET_STATE_SUCCESS":
            return {
                ...state,
                isSuccess: false,
                message: ""
            } 
        case "RESET_STATE_FAIL":
            return {
                ...state,
                isError: false,
                message: ""
            }
        case "REMOVE_ERROR":
            return {
                ...state,
                isError: false,
                message: ""
            }

        default: 
            return state
    }
}

interface TokenProps {
    token: string,
    id: number,
    refreshToken: string
}

export const AuthProvider = ({children}: ChildrenProps) => {
    //Set reducer for auth
    let [state, dispatch] = useReducer(authReducer, initialAuthValues);

    //Set auth token
    let [authToken, setAuthToken] = useState<string | undefined | null>(undefined);

    //Set email state
    let [id, setId] = useState<number | undefined | null>(undefined);

    //Set refreshToken
    let [refreshToken, setRefreshToken] = useState<string | undefined | null>(undefined);

    //Set is admin
    let [isAdmin, setIsAdmin] = useState<Boolean>(false);


    //Save success alert
    let saveSuccessAlert = (message? : string) => {

        dispatch({
            type: "LOG_IN_SUCCESS",
            payload: message
        })

        setTimeout(() => {
            dispatch({
                type: "RESET_STATE_SUCCESS"
            })
        }, 8000);
    }

    //Save fail alert
    let saveFailAlert = (message : string) => {
        dispatch({
            type: "LOG_IN_FAIL",
            payload: message
        })

        setTimeout(() => {
            dispatch({
                type: "RESET_STATE_FAIL"
            })
        }, 8000);
    }
 
    //Register user
    let logIn = (userInfo: TokenProps) => {
        setAuthToken(userInfo.token);
        setId(userInfo.id);
        setRefreshToken(userInfo.refreshToken);
        AsyncStorage.setItem("token", JSON.stringify(userInfo));
      
    }

    //Update token based on refresh token

    let updateToken = async (refreshToken : string, id : number) => {

        let response = await axios.post(WEB_URL + "/auth/refreshToken", {
            refreshToken: refreshToken
        });

        let data = response.data;

        let newData = {
            token: data.accessToken,
            id: data.id,
            refreshToken: data.refreshToken
        };

        setAuthToken(newData.token);
        setId(newData.id);
        setRefreshToken(newData.refreshToken);
        AsyncStorage.setItem("token", JSON.stringify(newData));
       
    }

    //Log out
    let toLogout = async () => {
       setAuthToken(undefined);
       setId(undefined);
       setRefreshToken(undefined);
       AsyncStorage.removeItem("token");
       AsyncStorage.removeItem("user");
       await axios.get(WEB_URL + "/auth/logout");
    }

    //Check user is admin or not 
    let checkIsAdmin = async (id : number, token : string) => {
        
        let config = {
            headers: {
                
                "Authorization": `Bearer ${token}`
            }
        }

        let response = await axios.get(WEB_URL + "/auth/checkIsAdmin/" + id, config);

        let data = response.data;

        console.log(data);

   
        
    }

    //Remove error when changing auth pages
    let removeError = () => {
        dispatch({
            type: "REMOVE_ERROR"
        })
    };
    
    return (<AuthContext.Provider value={{
        token: authToken,
        id: id,
        isAdmin: isAdmin,
        isAuthenticated: !!authToken,
        refreshToken: refreshToken,
        isSuccess: state.isSuccess,
        isError: state.isError,
        message: state.message,
        saveSuccessAlert: saveSuccessAlert,
        saveFailAlert: saveFailAlert,
        updateToken: updateToken,
        removeError: removeError,
        logIn: logIn,
        logOut: toLogout
    }}>
        {children}
    </AuthContext.Provider>)

   
}

export default AuthContext;