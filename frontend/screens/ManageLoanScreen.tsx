
import { dispatchStore, RootState } from '../store/redux/store';
import React, { useContext, useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, ListRenderItem} from "react-native";
import { useSelector } from 'react-redux';
import AuthContext from '../store/context/AuthContext';
import colors from '../constants/colors';
import CommonButton from '../ui/CommonButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import { fetchAllCheckouts } from '../store/redux/actions/CheckoutActions';
import { fetchAllHistories } from '../store/redux/actions/HistoryActions';
import { FlatList } from 'react-native-gesture-handler';
import { Checkout } from '../store/redux/reducers/CheckoutReducer';
import SingleCheckout from '../components/single_item_component/SingleCheckout';
import SingleHistory from '../components/single_item_component/SingleHistory';

function ManageLoanScreen() {

    //Get auth from auth context
    let {id, isAuthenticated, token} = useContext(AuthContext);


    //Get auth from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Set state for page name and active for button
    let [pageName, setPageName] = useState("loan");

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Get checkouts from redux

    let {checkouts, isSuccess, isError, message} = useSelector((state: RootState) => state.checkout);

    //Get histories from redux

    let {histories} = useSelector((state: RootState) => state.history);

    //Set to check that only customer is allowed to access this page
    useEffect(() => {

        if (!isAuthenticated || isAdmin) {
            navigation.navigate("MainPage");
        }

    },[isAuthenticated, isAdmin]);

    //Set effect to fetch loans or histories

    useEffect(() => {

        if (pageName === "loan" && token) {
            dispatchStore(fetchAllCheckouts(id as number, token as string) as any)
        } else if (pageName === "history" && token) {
            dispatchStore(fetchAllHistories(id as number, token as string) as any);
        }


    },[pageName, id, token]);

    //Handle single loan

    const handleSingleLoan : ListRenderItem<Checkout>= ({item, index} : any) => {

        let newItem = {
            ...item,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            token: token, 
            isSuccess: isSuccess,
            isError: isError,
            message: message
        }

        return <SingleCheckout {...newItem}/>;
    }

    //Handle single history

    const handleSingleHistory : ListRenderItem<History> = ({item, index} : any) => {

        return <SingleHistory {...item} />;
    }

    

  return (
    <View style={styles.screen}>
        <View style={styles.body}>
            <View style={styles.buttonsContainer}>
               <CommonButton onPress={() => setPageName("loan")} active={pageName === "loan"}> Loan </CommonButton>
               <CommonButton onPress={() => setPageName("history")} active={pageName === "history"}> History </CommonButton>
            </View>

            {(pageName === "loan" && checkouts.length > 0) && (
                <View style={styles.list}>
                    <FlatList data={checkouts} renderItem={handleSingleLoan} keyExtractor={(item : any, index : any) => item.id}/>
                </View>
            )}

            {(pageName === "loan" && checkouts.length === 0) && (
                <View style={styles.list}>
                   <Text style={styles.errorText}> There are no loans! </Text>
                </View>
            )}

            {(pageName === "history" && histories.length > 0) && (
                <View style={styles.list}>
                    <FlatList data={histories} renderItem={handleSingleHistory} keyExtractor={(item: any, index : any) => item.id}/>
                </View>
            )}

{            (pageName === "history" && histories.length === 0) && (
                <View style={styles.list}>
                    <Text style={styles.errorText}> There are no histories! </Text>
                </View>
            )}  
       
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: colors.skinColor
    },
    buttonsContainer: {
        flexDirection: "row",
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    list: {
        marginHorizontal: 5,
        marginTop: 12,
        marginBottom: 80
    },
    errorText: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 24,
        fontWeight: "bold",
        color: colors.red
    }

});

export default ManageLoanScreen