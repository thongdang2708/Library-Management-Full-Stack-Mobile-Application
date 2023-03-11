
import React, { useContext, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList} from "react-native";
import CommonButton from '../ui/CommonButton';
import { useState } from 'react';
import AuthContext from '../store/context/AuthContext';
import { useSelector } from 'react-redux';
import { dispatchStore, RootState } from '../store/redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import { fetchAllAnsweredQuizzes, fetchAllUnansweredQuizzes } from '../store/redux/actions/QuestionActions';
import { ListRenderItem } from 'react-native';
import { Quiz } from '../store/redux/reducers/QuestionReducer';
import SingleQuizByAdmin from '../components/single_item_component/SingleQuizByAdmin';

function ManageQuestionScreenByAdmin() {

    //Set page name
    let [pageName, setPageName] = useState("pending");

    //Get auth from auth context

    let {isAuthenticated, token, id} = useContext(AuthContext);


    //Get auth from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Get quizzes from redux
    let {quizzes} = useSelector((state : RootState) => state.quiz);

    //Set effect to check admin is only allowed

    useEffect(() => {

        if (!isAuthenticated || !isAdmin) {
            navigation.navigate("MainPage");
        }

    },[isAuthenticated, isAdmin]);

    //Fetch unanswered quizzes or answered quizzes

    useEffect(() => {

        if (pageName === "pending" && token) {
            dispatchStore(fetchAllUnansweredQuizzes(token as string) as any);
        } else if (pageName === "complete" && token) {
            dispatchStore(fetchAllAnsweredQuizzes(token as string) as any);
        }

    }, [pageName, token]);

    //Handle single quiz
    const handleRenderItem : ListRenderItem<Quiz> = ({item, index} : any) => {

        let newItem = {
            ...item,
            userId: id,
            token: token
        }

        return <SingleQuizByAdmin {...newItem}/>
    }


  return (
    <View style={styles.screen}>
        <View style={styles.buttonsContainer}>
               <CommonButton onPress={() => setPageName("pending")} active={pageName === "pending"}> Pending </CommonButton>
               <CommonButton onPress={() => setPageName("complete")} active={pageName === "complete"}> Complete </CommonButton>
        </View>

        <View style={styles.pageList}>
            <FlatList data={quizzes} renderItem={handleRenderItem} keyExtractor={(item: any, index : any) => item.id}/>
        </View>
    </View>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    buttonsContainer: {
        flexDirection: "row",
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    pageList: {
        marginTop: 12,
        marginBottom: 80
    }
    
});

export default ManageQuestionScreenByAdmin