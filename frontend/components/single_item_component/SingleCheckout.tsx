
import React, { useEffect } from 'react';
import {View, Text, StyleSheet, Alert} from "react-native";
import colors from '../../constants/colors';
import { useState } from 'react';
import { Checkout } from '../../store/redux/reducers/CheckoutReducer';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { checkReturnOnTime, resetAfterBorrowing, returnBook, setExtendedLoanForBook } from '../../store/redux/actions/CheckoutActions';
import CommonButton from '../../ui/CommonButton';
import { dispatchStore } from '../../store/redux/store';
import { addHistory } from '../../store/redux/actions/HistoryActions';


interface SingleCheckoutProps extends Checkout {
    isAuthenticated: boolean,
    isAdmin: boolean,
    token: string,
    isSuccess: boolean,
    isError: boolean,
    message: string
}


function SingleCheckout({id, bookName, borrowDate, returnDate, bookId, dateToReturn,customerId, isReturned ,isAuthenticated, isAdmin, token, isSuccess, isError, message} : SingleCheckoutProps) {

  //Set state for check return on time
  let [returnOnTime, setReturnOnTime] = useState();
  let [dueLength, setDueLength] = useState();
  let [successMessage, setSuccessMessage] = useState("");

  //Set error
  let [error, setError] = useState();


  //Check date
  let checkDate = new Date(dateToReturn).getTime() < new Date().getTime();

  //Set effect to whether book is returned on time

  useEffect(() => {

    if (isAuthenticated && !isAdmin) {
        async function fetchCheckReturnOntime () {

          try {

          let data = await checkReturnOnTime(id, bookId, customerId, token);

          setReturnOnTime(data.condition);
          setDueLength(data.dueLength);
          

          } catch (error : any) {

            let message = error.response.data.messages[0].toString();
            
            setError(message);
          }
        }
        fetchCheckReturnOntime();
    }


  },[isAuthenticated, isAdmin, token, id, bookId, customerId, returnOnTime, checkDate, isReturned]);

  //Set effect when set extended loan or return book successfully!

  useEffect(() => {

    if (isSuccess) {
      showToast("success", message);
    } else if (isError) {
      showToast("error", message);
    }

    dispatchStore(resetAfterBorrowing() as any);
    setSuccessMessage("");


  },[isSuccess, isError, message]);


   //Set function to toast
   const showToast = (type: string, text: string) => {
      Toast.show({
          type: type,
          text1: text
      })
  } 


  //Function to extend the loan
  const extendBook = () => {
    dispatchStore(setExtendedLoanForBook(id, bookId, customerId, token, "You extend a book with id number: " + bookId + " in the system successfully!") as any);
  }


  //Set extend loan
  const setExtendLoan = () => {
    Alert.alert("Let\t's extend this book", "Are you sure to extend this book?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel to extend this book!"),
          style: "cancel"
      },
      {
          text: "OK to extend this book",
          onPress: extendBook,
      }
  ]);
  }

  //Function to return book
  const returnBookBack = () => {
      dispatchStore(returnBook(id, bookId, customerId, token, "You returned the book with id " + bookId + " successfully!") as any);
      dispatchStore(addHistory(id, bookId, customerId, token) as any);
  };

  //Handle return book
  const handleReturn = () => {
    Alert.alert("Let\t's return this book", "Are you sure to return this book?", [
      {
          text: "Cancel",
          onPress: () => console.log("Cancel to return this book!"),
          style: "cancel"
      },
      {
          text: "OK to return this book",
          onPress: returnBookBack,
      }
  ]);
  };

  return (
    <View style={styles.checkoutContainer}>
      <Text style={styles.minorTitle}> Book Name: {bookName} </Text>
      <Text style={styles.minorTitle}> Borrow Date: {borrowDate}</Text>
      <Text style={styles.minorTitle}> Expected Return Date: {dateToReturn} </Text>
      <Text style={styles.minorTitle}> Return Date: <Text> {returnDate == null ? "Not Returned Yet" : returnDate} </Text> </Text>

      <View style={styles.buttonsContainer}>

        {!isReturned ? 
        ( 
          <>
          {returnOnTime && (<CommonButton onPress={setExtendLoan}> Extend Loan </CommonButton>)}
          {!returnOnTime && (
            <>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}> You do not return on time. Therefore, you are not allowed to set extended books! </Text>
            </View>

            <View style={styles.errorContainer}>
              <Text style={styles.errorText}> Your late due is around: {dueLength} </Text>
            </View>
            </>
          )}
          </>
        ) 
        
        :  
        
        (
          <View style={[styles.errorContainer, {backgroundColor: colors.green}]}>
            <Text style={styles.errorText}> This book is returned already! </Text>
          </View>
        )}
     
        {!isReturned && (<CommonButton onPress={handleReturn}> Return Book </CommonButton>)}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
    checkoutContainer: {
      marginHorizontal: 10,
      marginBottom: 20,
      padding: 10,
      backgroundColor: colors.offWhite,
      borderRadius: 4,
      borderWidth: 2
    },
    minorTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 8
    },
    buttonsContainer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    },
    errorContainer: {
      padding: 5,
      backgroundColor: colors.red,
      borderRadius: 4,
      borderWidth: 2,
      marginVertical: 10
    },
    errorText: {
      fontSize: 14,
      textAlign: "center",
      fontWeight: "bold"
    }
});

export default SingleCheckout