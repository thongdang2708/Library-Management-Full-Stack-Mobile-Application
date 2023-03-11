
import React from 'react';
import { useWindowDimensions } from 'react-native';
import {View, Text, StyleSheet} from "react-native";
import colors from '../../constants/colors';
import { deleteCustomer } from '../../store/redux/actions/CustomerByAdminActions';
import { Customer } from '../../store/redux/reducers/CustomerReducer';
import { dispatchStore } from '../../store/redux/store';
import CommonIconButton from '../../ui/CommonIconButton';

interface CustomerProps extends Customer {
    token: string
}

function SingleCustomer({id, token} : CustomerProps) {

    //Get width
    let width = useWindowDimensions().width;

    //Handle delete customer;

    const handleDelete = () => {
        dispatchStore(deleteCustomer(id, token, "Delete this customer succesfully!") as any);
    };

  return (
    <>

    <View style={styles.iconBox}>
        <CommonIconButton name={"close-outline"} color={colors.red} backgroundColor={colors.lightPink} width={width / 10} size={24} onPress={handleDelete}/>
    </View>


   <View style={styles.customerContainer}>
       <Text style={styles.textContent}> Customer Id With Id: {id} </Text>
   </View>
   </>
  )
};

const styles = StyleSheet.create({
    customerContainer: {
        marginHorizontal: 15,
        padding: 15,
        borderRadius: 4,
        backgroundColor: colors.offWhite,
        borderWidth: 2
    },
    textContent: {
        fontSize: 14,
        fontWeight: "bold"
    },
    iconBox: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginHorizontal: 14 
    }
});

export default SingleCustomer