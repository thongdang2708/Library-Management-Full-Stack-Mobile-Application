
import React, { useEffect } from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView} from "react-native";
import colors from '../constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useContext } from 'react';
import axios from 'axios';
import { WEB_URL } from '@env';
import { UserInputProps } from '../interface/AuthInterface';
import AuthContext from '../store/context/AuthContext';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { RootParamList } from '../App';
import Form from '../components/Form';


console.log(WEB_URL);


function LogInScreen() {

    //Get auth context
    let {isSuccess, isError, message, saveSuccessAlert, logIn, saveFailAlert} = useContext(AuthContext);

    //Set navigation 
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set toast
    const toastShow = (text : string, type: string) => {
        Toast.show({
            type: text,
            text1: type
        })
    }

    //Set log in function
    let logInFunction = async (userInputs : UserInputProps) => {
      let newInputs : UserInputProps = {
        email: userInputs.email,
        password: userInputs.password
      };

      try {

        let response = await axios.post(WEB_URL + "/login", newInputs);
    
        let data = response.data;
        console.log(data);
        saveSuccessAlert();
        logIn({
          token: data.accessToken,
          id: data.id,
          refreshToken: data.refreshToken
        });
        
       
        toastShow("success", "You log in successfully!");
        navigation.navigate("MainPage");
    
        } catch (error : any) {
            saveFailAlert(error.response.data.toString());
        }   
  };

  


  if (Platform.OS === "ios") {
    return (
      
      <View style={styles.screen}> 
        <View style={styles.headerBodyPart}>
            <Text style={styles.headerTitle}> Log In Page </Text> 
        </View>

        <KeyboardAwareScrollView style={styles.formPart}>
            <View>
              <Text style={styles.formTitle}> Log In Page </Text> 
            </View>

            <Form isLogin={true} getAuthentication={logInFunction}/>

           
        </KeyboardAwareScrollView>
      </View>
    
    )
  }
  
  return (
    <View style={styles.screen}> 
    <View style={styles.headerBodyPart}>
        <Text style={styles.headerTitle}> Log In Page </Text> 
    </View>

    <ScrollView style={styles.scrollView}>
      <KeyboardAvoidingView style={styles.formPart}>
        <View>
          <Text style={styles.formTitle}> Log In </Text> 
        </View>

        <Form isLogin={true} getAuthentication={logInFunction}/>

       
        </KeyboardAvoidingView>
    </ScrollView>
  </View>)
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  screen: {
    flex: 1,
    backgroundColor: colors.lightGreen,
  },
  body: {
    flex: 1,
    backgroundColor: colors.orange
  },
  headerBodyPart: {
    flex: 0.3,
    padding: 5,
    justifyContent: "center"
  },
  titlePart: {
    flex: 1,
    justifyContent: "center",
  },
  formPart: {
    flex: 0.7,
    backgroundColor: "white",
    borderWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  formTitle: {
    marginVertical: 15,
    fontWeight: "bold",
    fontSize: 28,
    marginHorizontal: 15
  },
  headerTitle: {
    marginVertical: 15,
    fontWeight: "bold",
    fontSize: 28,
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

export default LogInScreen