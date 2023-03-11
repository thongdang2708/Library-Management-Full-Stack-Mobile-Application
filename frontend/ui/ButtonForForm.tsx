import React from 'react';
import { Pressable } from 'react-native';
import {View, Text, StyleSheet} from "react-native";
import colors from '../constants/colors';


interface ButtonProps {
    children: React.ReactNode,
    onPress: () => void,
    minor?: string
}

function ButtonForForm({children, onPress, minor} : ButtonProps) {
  return (
    <View style={styles.outerButtonContainer}>
        <Pressable onPress={onPress} style={({pressed}) => pressed && styles.pressedButton} android_ripple={{color: colors.offWhite}}>
            <View style={[styles.innerButtonContainer, minor === "minor" && styles.minorButton]}>
            <Text style={styles.text}> {children} </Text>
            </View>
        </Pressable>
    </View>
  )
};

const styles = StyleSheet.create({
    outerButtonContainer: {
        marginVertical: 10,
        borderRadius: 4,
        borderWidth: 1.5,
        elevation: 4,
        shadowColor: "grey",
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.35
    },
    text: {
        textAlign: "center",
        fontWeight: "bold"
    },
    innerButtonContainer: {
        padding: 5,
        backgroundColor: colors.lightGreen
    },
    pressedButton: {
        opacity: 0.35
    },
    minorButton: {
        backgroundColor: colors.neon
    }
});

export default ButtonForForm