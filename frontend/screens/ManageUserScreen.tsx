
import React, { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../store/context/AuthContext';
import { View, Text, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import colors from '../constants/colors';
import { useSelector } from 'react-redux';
import { dispatchStore, RootState } from '../store/redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import { getAllCustomers, resetFunctionForManagingCustomer } from '../store/redux/actions/CustomerByAdminActions';
import { Customer } from '../store/redux/reducers/CustomerReducer';
import SingleCustomer from '../components/single_item_component/SingleCustomer';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

function ManageUserScreen() {

    //Get auth context
    let {isAuthenticated, token} = useContext(AuthContext);

    //Get auth from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set function to toast

    const showToast = (type: string, text: string) => {
        Toast.show({
            type: type,
            text1: text
        })
    };


    //Set effect to check admin
    useEffect(() => {

        if (!isAuthenticated || !isAdmin) {
            navigation.navigate("MainPage");
        }
    }, [isAuthenticated, isAdmin]);

    //Set effect to fetch customers
    useEffect(() => {

        if (token) {
            dispatchStore(getAllCustomers(token) as any);
        }

    },[token]);

    //Get customers from redux
    let {customers, isSuccess, isError, message} = useSelector((state : RootState) => state.customer);

    //Render single item
    const handleRenderItem : ListRenderItem<Customer> = ({item, index} : any) => {

        let newItem = {
            ...item,
            token: token
        }
        

        return <SingleCustomer {...newItem}/>
    }

    // Set effect when deleting the customer successfully or not
    useEffect(() => {

        if (isSuccess) {
            showToast("success", message);
        } else if (isError) {
            showToast("error", message);
        }

        dispatchStore(resetFunctionForManagingCustomer() as any);
        
    },[isSuccess, isError, message]);

  return ( 
    <View style={styles.screen}>
        <Text style={styles.title}> Manage User Screen </Text> 


        {customers.length === 0 
        
        ? 
        
        (
            <Text style={styles.errorText}> There are no customers! </Text>
        )
        
        :

        (   
            <>
            <View style={styles.list}>
            <FlatList data={customers} renderItem={handleRenderItem} keyExtractor={(item : any, index : any) => item.id}/>
            </View>
            </>
        )
    }

        
    </View>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.skinColor
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        marginVertical: 15,
        fontWeight: "bold"
    },
    list: {
        marginTop: 12,
        marginBottom: 80
    },
    errorText: {
        textAlign: "center",
        fontSize: 24,
        marginVertical: 20,
        color: colors.red,
        fontWeight: "bold"
    }
});

export default ManageUserScreen