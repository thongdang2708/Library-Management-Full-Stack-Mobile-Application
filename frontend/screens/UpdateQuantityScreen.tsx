
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import {View, Text} from "react-native";
import { useSelector } from 'react-redux';
import { RootParamList } from '../App';
import AuthContext from '../store/context/AuthContext';
import { StyleSheet } from 'react-native';
import { getSingleBook, handleDecreaseBook, handleIncreaseBook } from '../store/redux/actions/ProductActions';
import { dispatchStore, RootState } from '../store/redux/store';
import colors from '../constants/colors';
import CommonButton from '../ui/CommonButton';



function UpdateQuantityScreen({route} : any) {

    //Get param
    
    let id = route.params?.id;
    
    console.log(id);

    // Get auth from context
    let {isAuthenticated, token} = useContext(AuthContext);

    // Get is admin from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Get single book
    let {book} = useSelector((state: RootState) => state.book);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set effect to check is authenticated and is admin
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigation.navigate("MainPage");
        }
    },[isAuthenticated, isAdmin])

    //Set effect to fetch single book
    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            dispatchStore(getSingleBook(id) as any);
        }
    },[id, isAuthenticated, isAdmin, token]);

    //Set change 
    const handleChange = (text : string) => {
        if (text === "increase") {
            dispatchStore(handleIncreaseBook(id, token as string) as any);
        } else {
            dispatchStore(handleDecreaseBook(id, token as string) as any);
        }
    }

  return (
    <View style={styles.screen}>
        <View style={styles.body}>
       <Text style={styles.minorTitle}>
           Book name: {book.name}
       </Text>
       <Text style={styles.minorTitle}>
           Total Quantity: {book.quantity}
       </Text>

       <Text style={styles.minorTitle}>
           Available Quantity: {book.availableQuantity}
       </Text>

       <CommonButton onPress={() => handleChange("increase")}> Increase Quantity </CommonButton>
       <CommonButton onPress={() => handleChange("decrease")}> Decrease Quantity </CommonButton>
       </View>
    </View>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.skinColor
    },
    body: {
        flex: 1,
        marginHorizontal: 15,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    minorTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 15
    }
})

export default UpdateQuantityScreen