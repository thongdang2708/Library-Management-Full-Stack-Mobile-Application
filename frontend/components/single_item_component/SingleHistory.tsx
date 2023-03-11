
import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import colors from '../../constants/colors';
import {History} from "../../store/redux/reducers/HistoryReducer";


function SingleHistory({id, bookName, borrowDate, returnDate} : History) {
  return (
   <View style={styles.container}>
     <Text style={styles.minorTitle}> Book Name: {bookName} with history id {id} </Text>
     <Text style={styles.minorTitle}> Borrow Date: {borrowDate} </Text>
     <Text style={styles.minorTitle}> Return Date: {returnDate} </Text>
   </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: colors.offWhite,
    marginVertical: 10
  },
  minorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5
  }
});

export default SingleHistory