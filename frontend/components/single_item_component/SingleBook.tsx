
import React, { useContext } from 'react';
import {View, Text, StyleSheet, Image, Pressable} from "react-native";
import { Book } from '../../store/redux/reducers/ProductReducer';
import { WEB_URL } from '@env';
import colors from '../../constants/colors';
import AuthContext from '../../store/context/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/redux/store';
import CommonButton from '../../ui/CommonButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../App';

function SingleBook({id, urlImage, name, createdAt, quantity, availableQuantity} : Book) {

    //Get auth context
    let {isAuthenticated} = useContext(AuthContext);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();
    

    //Get auth from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Set moving page
    let handleMovingPage = () => {
        navigation.navigate("UpdateQuantityScreen", {
            id: id
        })
    };

    //Handle press
    const handlePress = () => {
        navigation.navigate("SingleBookDisplay", {
            id: id
        })
    };
    
  return (
    <>
    <Pressable onPress={handlePress}>
    <View style={styles.singleBox}>

        <View style={styles.imageContainer}>
            <Image source={{uri: WEB_URL + "/api/v1/books/readFile/" + urlImage}} style={styles.image}/>
        </View>

        <View style={styles.infoContainer}>
        <Text style={styles.textInfo}> Name: {name} </Text> 
        <Text style={styles.textInfo}> Created at: {createdAt} </Text>
        <Text style={styles.textInfo}> Quantity: {quantity} </Text>
        <Text style={styles.textInfo}> Available quantity: {availableQuantity} </Text>
       
        </View>
        
    </View>
    </Pressable>

     {(isAuthenticated && isAdmin) && (
            <Pressable onPress={handleMovingPage}>
                <View style={styles.button}>
                    <Text style={styles.textButton}> Update Quantity! </Text> 
                </View>
            </Pressable>
        )}

  
    </>
  )
}

const styles = StyleSheet.create({
    singleBox: {
        marginTop: 10,
        marginBottom: 7, 
        marginHorizontal: 5,
        borderWidth: 2, 
        padding: 5,
        flexDirection: "row",
        flex: 1,
        borderRadius: 5,
        elevation: 4,
        shadowColor: "grey",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.45,
        shadowRadius: 4,
        backgroundColor: colors.skinColor
    },
    imageContainer: {
        flex: 1,
        borderWidth: 2
    },
    infoContainer: {
        flex: 2,
        marginLeft: 20
    },
    image: {
        height: 100,
        resizeMode: "cover"
    },
    textInfo: {
        fontWeight: "bold",
        marginVertical: 5
    },
    button: {
        marginVertical: 2,
        marginHorizontal: 12,
        backgroundColor: colors.neon,
        borderRadius: 4,
        padding: 2,
        borderWidth: 1.5
    },
    textButton: {
        textAlign: "center",
        fontWeight: "bold",
    }
});

export default SingleBook