import React from 'react';
import ButtonForForm from '../ui/ButtonForForm';
import { RootParamList } from '../App';
import { useState } from 'react';
import { useContext } from 'react';
import { UserInputProps } from '../interface/AuthInterface';
import colors from '../constants/colors';
import AuthContext from '../store/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import Input from './Input';


interface FormProps {
    isLogin: boolean,
    getAuthentication: (userInputs : UserInputProps) => void
}

interface isValidProps {
    username: undefined | boolean,
    email: undefined | boolean,
    password: undefined | boolean,
    confirmPassword: undefined | boolean,
}


function Form( {isLogin, getAuthentication} : FormProps) {

     //Get auth context
    let {isSuccess, isError, message, removeError} = useContext(AuthContext);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set state for inputs
    let [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    //Set state for valid for inputs

    let [isValid, setIsValid] = useState<isValidProps>({
        username: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined
    });

    //Handle change inputs
    const handleChangeInput = (key : string, value : string) => {

        setInputs((input) => {
            return {
                ...input,
                [key]: value
            }
        })
    }

    //Handle Change Page

    const handleChangePage = () => {
        if (!isLogin) {
            navigation.navigate("LogInScreen");
        } else {
            navigation.navigate("RegisterScreen");
        }

        removeError();
        
    }

    //Handle to main page

    const handleToMainPage = () => {
        navigation.navigate("MainPage");
    }

     //Handle submit

     const handleSubmit = () => {

        let userInputs = {
            username: inputs.username,
            email: inputs.email,
            password: inputs.password,
            confirmPassword: inputs.confirmPassword
        };

    // Regex for password
    // •	Should contain at least a capital letter
	// •	Should contain at least a small letter
	// •	Should contain at least a number
	// •	Should contain at least a special character
	// •	And minimum length is 8
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

    // Regex for email

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/


        let usernameIsValid = isLogin === false ? (userInputs.username.length >= 4 && userInputs.username.length <= 20) : true;
        let emailIsValid = regexEmail.test(userInputs.email) && ((userInputs.email.length >= 4 && userInputs.email.length <= 30));
        let passwordIsValid = regexPassword.test(userInputs.password) && ((userInputs.password.length >= 8 && userInputs.password.length <= 30));
        let confirmPasswordIsValid = isLogin === false ? userInputs.password === userInputs.confirmPassword && userInputs.confirmPassword.length > 0 : true;


        if (!usernameIsValid || !emailIsValid || !passwordIsValid || !confirmPasswordIsValid) {
            
            setIsValid((valid) => {
                return {
                    username: usernameIsValid,
                    email: emailIsValid,
                    password: passwordIsValid,
                    confirmPassword: confirmPasswordIsValid
                }
            })

            setTimeout(() => {
                setIsValid((valid) => {
                    return {
                        username: undefined,
                        email: undefined,
                        password: undefined,
                        confirmPassword: undefined
                }
                })

            }, 3000);
            return;
        }
        
        getAuthentication({
            username: userInputs.username,
            email: userInputs.email,
            password: userInputs.password
        });
       
        setInputs({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
    }

   




  return (
    <View style={styles.form}>

        {isLogin === false && (<Input name='Username' textInputConfig={{
            placeholder: "Please enter your username",
            autoCorrect: false,
            autoCapitalize: "none",
            maxLength: 20,
            value: inputs.username,
            onChangeText: (text : string) => handleChangeInput("username", text)
        }} isValid={isValid.username === false} textInValid="Please check username. Username length min is 4 and max length is 20!"
        />)}

        <Input name='Email' textInputConfig={{
            placeholder: "Please enter your email",
            autoCorrect: false,
            autoCapitalize: "none",
            maxLength: 30,
            value: inputs.email,
            onChangeText: (text : string) => handleChangeInput("email", text)
        }} isValid={isValid.email === false} textInValid="Please check email. Email is invalid or email length min is 4 and max length is 30!"/>

        <Input name='Password' textInputConfig={{
            placeholder: "Please enter your password",
            autoCorrect: false,
            secureTextEntry: true,
            maxLength: 30,
            value: inputs.password,
            onChangeText: (text : string) => handleChangeInput("password", text)
        }} isValid={isValid.password === false} textInValid="Please check password. Password shoud contain at least a capital letter, at least a small letter, at least a number, at least a special character, and min length is 8 characters and max length is 30 characters!"/>

        {isLogin === false && (
             <Input name='Confirm Password' textInputConfig={{
                placeholder: "Please confirm your password",
                autoCorrect: false,
                secureTextEntry: true,
                maxLength: 30,
                value: inputs.confirmPassword,
                onChangeText: (text : string) => handleChangeInput("confirmPassword", text)
            }} isValid={isValid.confirmPassword === false} textInValid="Confirm password does not match password!"/>
        )}

        {(isSuccess && !isLogin) && (
            <View style={styles.registerNoti}>
                <Text style={styles.textNoti}> {message} </Text> 
            </View>
        )}


        {(isError && !isLogin) && (
            <View style={styles.errorNoti}>
                 <Text style={styles.textNoti}> {message} </Text> 
            </View>
        )}

        {(isError && isLogin) && (
            <View style={styles.errorNoti}>
                 <Text style={styles.textNoti}> {message} </Text> 
            </View>
        )}


    


        <ButtonForForm onPress={handleSubmit}>
            {isLogin === false ? "Register" : "Log In"}
        </ButtonForForm>
            
        <ButtonForForm onPress={handleChangePage} minor="minor">
            {isLogin === false ? "You have an account? Please log in!" : "Don\'t you have an account? Please register!"}
        </ButtonForForm>

        <ButtonForForm onPress={handleToMainPage}>
            To Main Page!
        </ButtonForForm>
        
        
        
    </View>
  )
}

const styles = StyleSheet.create({
    form: {
        marginVertical: 20,
        marginHorizontal: 25
    },
    registerNoti: {
        marginVertical: 12,
        backgroundColor: colors.green,
        padding: 10,
        borderRadius: 4,
        borderWidth: 2
    },
    textNoti: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20
    },
    errorNoti: {
        marginVertical: 12,
        backgroundColor: colors.red,
        padding: 10,
        borderRadius: 4,
        borderWidth: 2
    }
});

export default Form