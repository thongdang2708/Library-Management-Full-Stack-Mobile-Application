import React from 'react';
import {View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback} from "react-native";
import { TextInput } from 'react-native';
import colors from '../constants/colors';


interface InputProps {
    name: string,
    textInputConfig: any,
    isValid: boolean,
    textInValid: string
}

function Input({name, textInputConfig, isValid, textInValid} : InputProps) {
  return (
    <View style={styles.inputGroup}>
        <Text style={styles.label}> 
            {name}: 
        </Text>
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} 
                                accessible={false}>
        <TextInput {...textInputConfig} style={styles.input} />
        </TouchableWithoutFeedback> 

        {isValid && (
            <View style={styles.errorContainer}>
            <Text style={styles.textError}> {textInValid} </Text>
            </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    inputGroup: {
        marginVertical: 20
    },
    input: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 5
    },
    label: {
        marginVertical: 8,
        fontWeight: "bold",
        fontSize: 15
    },
    errorContainer: {
        marginVertical: 10,
    },
    textError: {
        color: colors.red,
        fontWeight: "bold"
    }

});

export default Input