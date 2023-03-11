
import React from 'react';
import { useContext } from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Image} from "react-native";
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../store/context/AuthContext';
import colors from '../constants/colors';
import { WEB_URL } from '@env';
import Form from '../components/Form';
import { AdminInputProps, UserInputProps } from '../interface/AuthInterface';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import RegisterFormForAdmin from '../components/RegisterFormForAdmin';


function RegisterAdminScreen() {

  //Get auth context
  let {isSuccess, isError, message, saveSuccessAlert, saveFailAlert} = useContext(AuthContext);


  //Set register function
  let registerFunction = async (userInputs : AdminInputProps) => {
    console.log(userInputs);
    try {

      let response = await axios.post(WEB_URL + "/auth/admin/register", userInputs);
  
      let data = response.data;
  
      saveSuccessAlert(data.messages[0].toString());
  
      } catch (error : any) {
        
        let message = error.response.data.messages[0].toString() + " at " + error.response.data.timestamp;
        
        saveFailAlert(message);
      }
  };

  if (Platform.OS === "ios") {
    return (
      
      <View style={styles.screen}> 
        <View style={styles.headerBodyPart}>
            <Text style={styles.headerTitle}> Register Admin Page </Text> 
        </View>

        <KeyboardAwareScrollView style={styles.formPart}>
            <View>
              <Text style={styles.formTitle}> Register as Admin </Text> 
            </View>

            <RegisterFormForAdmin isLogin={false} getAuthentication={registerFunction}/>
            

        </KeyboardAwareScrollView>

        
      </View>
    
    )
  }
  
  return (
    <View style={styles.screen}> 
    <View style={styles.headerBodyPart}>
        <Text style={styles.headerTitle}> Register Page </Text> 
    </View>

    <ScrollView style={styles.scrollView}>
      <KeyboardAvoidingView style={styles.formPart}>
        <View>
          <Text style={styles.formTitle}> Register </Text> 
        </View>

       
        <RegisterFormForAdmin isLogin={false} getAuthentication={registerFunction}/>
       
        </KeyboardAvoidingView>
    </ScrollView>
  </View>
  )


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

export default RegisterAdminScreen;