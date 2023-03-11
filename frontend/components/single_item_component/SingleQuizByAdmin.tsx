
import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput} from "react-native";
import colors from '../../constants/colors';
import { Alert } from 'react-native';
import { Quiz } from '../../store/redux/reducers/QuestionReducer';
import { Modal } from 'react-native';
import CommonButton from '../../ui/CommonButton';
import { useWindowDimensions } from 'react-native';
import { addAnswerFunction, AnswerInput } from '../../store/redux/actions/QuestionActions';
import { dispatchStore } from '../../store/redux/store';




interface QuizInputProps extends Quiz {
    userId: number,
    token: string
}

function SingleQuizByAdmin({id, question, answer, adminId, userId, token} : QuizInputProps) {


    //Get height 
    let height = useWindowDimensions().height;
    
    //Handle modal
    let [modalIsVisible, setModalIsVisible] = useState(false);

    //Set state for answer
    let [answerQuiz, setAnswerQuiz] = useState("");
    let [answerValid, setAnswerValid] = useState(true);

    // Handle submit answer
    const submitAnswer = () => {
        
        let input : AnswerInput = {
            answer: answerQuiz
        }

        let answerIsValid = input.answer.length > 0;

        if (!answerIsValid) {

            setAnswerValid(false);

            setTimeout(() => {
                setAnswerValid(true);
            }, 3000);
            return;
        }

        dispatchStore(addAnswerFunction(id, userId, token, input) as any);
        setAnswerQuiz("");
    }


  return (
    <View style={styles.container}>
    <Text style={styles.title}> Quiz Id {id} </Text>
    <Text style={styles.title}> Question: </Text>
    <Text style={styles.text}> {question} </Text>

    {adminId == null 
    
    ?

    (
        <>
        <CommonButton onPress={() => setModalIsVisible(!modalIsVisible)}> Add Answer To Customer </CommonButton>

        <Modal
         animationType="fade"
         transparent={true}
         visible={modalIsVisible}
         onRequestClose={() => {
         Alert.alert("Modal has been closed.");
         setModalIsVisible(!modalIsVisible);
         }}
        >
        <View style={styles.modalScreen}>
            <View style={styles.modalContainer}>
                <Text style={[styles.title, {textAlign: "center", marginVertical: 20}]}> Add Answer To Customer </Text>
                
                <View style={styles.formGroup}>
                <TextInput multiline={true} placeholder="Enter your answer" autoCorrect={false} autoCapitalize="none" style={[styles.input, {height: height / 3}, !answerValid && {borderColor: colors.red}]} value={answerQuiz} onChangeText={(text : string) => setAnswerQuiz(text)} />
                
        </View>

        <CommonButton onPress={submitAnswer}> Submit answer </CommonButton>
        <CommonButton onPress={() => setModalIsVisible(!modalIsVisible)}> Close submit answer box </CommonButton>
        </View>
        </View>
        </Modal>
        </>
    ) 
    
    : 
    
    (
        <> 
           <Text style={styles.title}> Answer: </Text>
             <Text style={styles.text}> {answer} </Text>
        </>
    )
    
    }
 
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
        fontSize: 14,
        marginVertical: 8
    },
    form: {
        marginVertical: 5
    },
    modalScreen: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    modalContainer: {
        height: "65%",
        width: "88%",
        backgroundColor: colors.offWhite,
        borderRadius: 4,
        borderWidth: 2
    },
    formGroup: {
        marginVertical: 12
    },
    input: {
        padding: 5,
        borderRadius: 4,
        borderWidth: 2,
        marginHorizontal: 15,
        textAlignVertical: "top",
    }
});

export default SingleQuizByAdmin