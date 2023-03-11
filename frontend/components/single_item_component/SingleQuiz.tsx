
import React from 'react';
import colors from "../../constants/colors";
import {View, Text, StyleSheet} from "react-native";
import { Quiz } from '../../store/redux/reducers/QuestionReducer';

function SingleQuiz({id, question, answer, adminId} : Quiz) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}> Quiz Id {id} </Text>
        <Text style={styles.title}> Question: </Text>
        <Text style={styles.text}> {question} </Text>
        <Text style={styles.title}> Answer: </Text>
        <Text style={styles.text}> {adminId == null ? "Not Answer Yet" : `${answer}`} </Text>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        backgroundColor: colors.skinColor,
        padding: 5,
        borderRadius: 4,
        borderWidth: 3,
        marginVertical: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    
    },
    text: {
        fontWeight: "bold",
        fontSize: 14
    }
}); 

export default SingleQuiz