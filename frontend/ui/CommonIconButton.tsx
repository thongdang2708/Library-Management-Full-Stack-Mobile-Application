import React from 'react';
import {View, Text, StyleSheet, Pressable} from "react-native"; 
import {Ionicons} from "@expo/vector-icons";
import colors from '../constants/colors';

interface ButtonProps {
    name: any,
    color: string,
    size: number,
    backgroundColor: string,
    width: number,
    onPress: () => void
}

function CommonIconButton({name, color, size, backgroundColor, width, onPress} : ButtonProps) {
  return (
    <View style={[styles.outerButtonContainer, {maxWidth: width}]}>
        <Pressable style={({pressed}) => pressed && styles.pressedButton} android_ripple={{color: colors.offWhite}} onPress={onPress}>
            <View style={[styles.innerButtonContainer, {backgroundColor: backgroundColor}]}>
                <Ionicons name={name} color={color} size={size}/>
            </View>
        </Pressable>
    </View>
  )
};
const styles = StyleSheet.create({
    outerButtonContainer: {
      borderRadius: 4,
      marginVertical: 5,
      borderWidth: 2,
      borderColor: colors.grey
    },
    innerButtonContainer: {
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    pressedButton: {
      opacity: 0.45
    }
});



export default CommonIconButton