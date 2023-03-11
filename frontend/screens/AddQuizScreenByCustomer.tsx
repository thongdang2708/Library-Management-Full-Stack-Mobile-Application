
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {View, Text} from "react-native";
import {StyleSheet} from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootParamList } from '../App';
import colors from '../constants/colors';
import AuthContext from '../store/context/AuthContext';
import { addQuestionFunction, QuestionInput } from '../store/redux/actions/QuestionActions';
import { dispatchStore, RootState } from '../store/redux/store';
import CommonButton from '../ui/CommonButton';

function AddQuizScreenByCustomer({route} : any) {

    //Get param
    let userId = route.params?.userId;
    let token = route.params?.token;

    //Get height of screen
    let height = useWindowDimensions().height;

    //Get auth context from context 
    let {isAuthenticated} = useContext(AuthContext);

    //Get auth from redux
    let {isAdmin} = useSelector((state : RootState) => state.user);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();


    console.log(userId, token);
    //Set effect to check only customer is allowed
    useEffect(() => {
        if (!isAuthenticated || isAdmin) {
            navigation.navigate("MainPage");
        }
    }, [isAuthenticated, isAdmin]);

    //Set state for question
    let [question, setQuestion] = useState("");
    let [questionValid, setQuestionValid] = useState(true);

    //Handle submit question 

    const submitQuestion = () => {

        let input : QuestionInput = {
            question: question
        };

        let questionIsValid = input.question.length > 0;

        if (!questionIsValid) {
            setQuestionValid(false);

            setTimeout(() => {
                setQuestionValid(true);
            }, 3000);

            return;
        };

        dispatchStore(addQuestionFunction(userId, token, input, "Add Question To Admin Successfully!") as any);
        setQuestion("");
        navigation.goBack();
        
    }


  return (
    <View style={styles.screen}>
        <Text style={styles.title}> Add Question </Text>
        
        <View style={styles.formGroup}>
        <TextInput multiline={true} placeholder="Enter your question" autoCorrect={false} autoCapitalize="none" style={[styles.input, {height: height / 2}, !questionValid && {borderColor: colors.red}]} value={question} onChangeText={(text : string) => setQuestion(text)} />
        {!questionValid && (
            <View>
                <Text style={styles.errorText}> Question must not be blank! </Text>
            </View>
        )}
        </View>

        <CommonButton onPress={submitQuestion}> Submit question </CommonButton>
    </View>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    title: {
        marginVertical: 10,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    formGroup: {
        marginVertical: 10
    },
    input: {
        padding: 5,
        borderRadius: 4,
        borderWidth: 2,
        marginHorizontal: 15,
        textAlignVertical: "top",
    },
    errorText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.red,
        textAlign: "center",
        marginVertical: 10
    }
});



export default AddQuizScreenByCustomer