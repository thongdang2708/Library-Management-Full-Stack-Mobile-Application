
import RegisterScreen from './screens/RegisterPage';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import LogInScreen from './screens/LogInPage';
import { AuthProvider } from './store/context/AuthContext';
import MainPage from './screens/MainPage';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from './store/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import AuthContext from './store/context/AuthContext';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { dispatchStore } from './store/redux/store';
import { checkAdminFunction } from './store/redux/actions/UserActions';
import RegisterAdminScreen from './screens/RegisterAdminPage';
import AddBookScreen from './screens/AddBookScreen';
import colors from './constants/colors';
import ManageLoanScreen from './screens/ManageLoanScreen';
import UpdateQuantityScreen from './screens/UpdateQuantityScreen';
import SearchBookScreen from './screens/SearchBookScreen';
import QuestionPageOfCustomers from './screens/QuestionPageOfCustomers';
import AddQuizScreenByCustomer from './screens/AddQuizScreenByCustomer';
import SingleBookDisplay from './components/single_item_component/SingleBookDisplay';
import ManageQuestionScreenByAdmin from './screens/ManageQuestionScreenByAdmin';
import ManageUserScreen from './screens/ManageUserScreen';
import { NativeModules } from 'react-native';
NativeModules.DevSettings.setIsDebuggingRemotely(false);


export type RootParamList = {
  MainPage: undefined,
  RegisterScreen: undefined,
  LogInScreen: undefined,  
  RegisterAdminScreen: undefined,
  AddBookScreen: undefined,
  SearchBookScreen: undefined,
  UpdateQuantityScreen: {
      id: number
  },
  SingleBookDisplay: {
      id: number
  },
  ManageLoanScreen: undefined,
  QuestionPageOfCustomers: undefined,
  AddQuizScreenByCustomer: {
    userId: number,
    token: string
  },
  ManageQuestionScreenByAdmin: undefined,
  ManageUserScreen: undefined
}

//Set time to refresh token
let timeForRefreshToken = 10 * 1000;


const Stack = createStackNavigator();

const RootApp = () => {

 

   //Get auth context
   let {isAuthenticated, logIn, logOut, refreshToken, id, updateToken, token} = useContext(AuthContext);


    //Get auth state from redux

    let {isAdmin, isSuccess, isError, message} = useSelector((state: RootState) => state.user);


   //Set effect to get stored token in async storage
   useEffect(() => {
     async function getToken () {
       let storedToken = await AsyncStorage.getItem("token");

      console.log(storedToken);
       if (storedToken) {

         logIn(JSON.parse(storedToken));

       }
     }
 
     getToken();
   },[]);
   
  
  //  Set effect to set interval to refresh token
 
   useEffect(() => {
 
     if (isAuthenticated && refreshToken !== undefined || null) {
         let idInterval = setInterval(() => {
           updateToken(refreshToken as string, id as number);
         }, timeForRefreshToken);
 
         return () => clearInterval(idInterval);
     } 
 
   },[isAuthenticated, refreshToken, id])
  
   useEffect(() => {
      if (isAuthenticated && token && id) {
        dispatchStore(checkAdminFunction(id as number, token as string) as any);
      }
   },[isAuthenticated, token, id]);
   

  return (<Stack.Navigator>
        <Stack.Screen name="MainPage" component={MainPage} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="LogInScreen" component={LogInScreen} options={{
          headerShown: false
        }}/>
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{
          headerShown: false
        }}/>
        <Stack.Screen name='RegisterAdminScreen' component={RegisterAdminScreen} options={{
          headerShown: false
        }}/>
        <Stack.Screen name="AddBookScreen" component={AddBookScreen} options={{
          headerTitle: "Add Book By Admin",
          headerStyle: {backgroundColor: colors.lightGreen}
        }}/>
        <Stack.Screen name="SearchBookScreen" component={SearchBookScreen} options={{
            headerTitle: "Search Book Page",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>
        <Stack.Screen name="UpdateQuantityScreen" component={UpdateQuantityScreen} options={{
            presentation: "modal",
            headerTitle: "Update Quantity Screen",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>
        <Stack.Screen name="SingleBookDisplay" component={SingleBookDisplay} options={{
            headerTitle: "Single Book Display",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>

        <Stack.Screen name='ManageLoanScreen' component={ManageLoanScreen} options={{
            headerTitle: "Loan And History",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>

        <Stack.Screen name="QuestionPageOfCustomers" component={QuestionPageOfCustomers} options={{
            headerTitle: "Question List",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>

        <Stack.Screen name='AddQuizScreenByCustomer' component={AddQuizScreenByCustomer} options={{
            presentation: "modal",
            headerTitle: "Add Question",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>

        <Stack.Screen name="ManageQuestionScreenByAdmin" component={ManageQuestionScreenByAdmin} options={{
            headerTitle: "Question Management By Admin",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>

        <Stack.Screen name="ManageUserScreen" component={ManageUserScreen} options={{
            headerTitle: "User Management By Admin",
            headerStyle: {backgroundColor: colors.lightGreen}
        }}/>
        
    </Stack.Navigator>)
}


export default function App() {



  return ( 
    <>
     
    <StatusBar backgroundColor={colors.lightGreen}/>
    <Provider store={store}>
    <AuthProvider>
      <NavigationContainer>
      <RootApp />
      </NavigationContainer>
    </AuthProvider>
    </Provider>
    <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
