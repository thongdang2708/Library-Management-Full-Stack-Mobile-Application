
import React, { useEffect, useLayoutEffect } from 'react';
import {View, Text} from "react-native";
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { dispatchStore, RootState } from '../store/redux/store';
import AuthContext from '../store/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import { fetchAllQuizzes } from '../store/redux/actions/QuestionActions';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import CommonIconButton from '../ui/CommonIconButton';
import { useWindowDimensions } from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import { FlatList } from 'react-native-gesture-handler';
import { ListRenderItem } from 'react-native';
import { Quiz } from '../store/redux/reducers/QuestionReducer';
import SingleQuiz from '../components/single_item_component/SingleQuiz';

function QuestionPageOfCustomers() {


      //Get width screen

      let width = useWindowDimensions().width;

      //Get auth context
      let {isAuthenticated, token, id} = useContext(AuthContext);

      //Get auth from redux
      let {isAdmin} = useSelector((state: RootState) => state.user);

      //Set navigation
      let navigation = useNavigation<StackNavigationProp<RootParamList>>();

      //Set effect to check that allows customers only
      useEffect(() => {

        if (!isAuthenticated || isAdmin) {
            navigation.navigate("MainPage");
        }

      },[isAuthenticated, isAdmin]);

      //Handle press to add quiz page

      const handlePress = () => {
          navigation.navigate("AddQuizScreenByCustomer", {
              userId: id as number,
              token: token as string
          })
      };

      //Set header right
      useLayoutEffect(() => {

        navigation.setOptions({
            headerRight: ({tintColor}) => {
                return <Ionicons name='add-outline' color={colors.red} size={30} style={{marginHorizontal: 20, fontWeight: "bold"}} onPress={handlePress}/>
            }
        })
        
      },[navigation,]);

      //Set effect to fetch quizzes
      useEffect(() => {

        if (token) {
            dispatchStore(fetchAllQuizzes(token as string) as any); 
        }
      },[token]);

      //Get state of quiz from redux
      let {quizzes} = useSelector((state: RootState) => state.quiz);
      

      //Handle render item
      let handleRenderItem : ListRenderItem<Quiz> = ({item, index} : any) => {

        return <SingleQuiz {...item}/>
        
      }


  return (
    <View style={styles.screen}>
        <Text style={styles.title}> Question List Between Customer And Admin </Text>

        {quizzes.length === 0 
        
        ? 

        (
            <View>
                <Text style={styles.errorText}> There are not quizzes between customers and admins! </Text>
            </View>
        )
        :
        (
            <View style={styles.list}>
                <FlatList data={quizzes} renderItem={handleRenderItem} keyExtractor={(item : any, index : any) => item.id}/>
            </View>
        )
        }
    </View>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    title: {
        marginVertical: 15,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center"
    },
    errorText: {
        fontSize: 15,
        textAlign: "center",
        fontWeight: "bold",
        color: colors.red
    },
    list: {
        marginVertical: 10
    }
});

export default QuestionPageOfCustomers