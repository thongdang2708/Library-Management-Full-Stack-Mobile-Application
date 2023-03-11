
import { SafeAreaView } from "react-native-safe-area-context";
import {View, Text, StyleSheet} from "react-native";
import CommonButton from "../ui/CommonButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootParamList } from "../App";
import { useContext } from "react";
import AuthContext from "../store/context/AuthContext";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/redux/store";
import { dispatchStore } from "../store/redux/store";
import { checkAdminFunction } from "../store/redux/actions/UserActions";
import axios from "axios";
import { WEB_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logoutFunction } from "../store/redux/actions/UserActions";
import colors from "../constants/colors";


function MainPage() {

    //Get auth context
    let {isAuthenticated, id, token, logOut} = useContext(AuthContext);


    let {isAdmin} = useSelector((state: RootState) => state.user);
    

    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set function to move to log in or register page

    const handlePress = (page : string) => {
        if (page === "login") {
            navigation.navigate("LogInScreen");
        } else if (page === "registerAsAdmin") {
            navigation.navigate("RegisterAdminScreen");
        } else {
            navigation.navigate("RegisterScreen");
        }
    };


    //Handle log out when is authenticated
    const handleLogOut = () => {

        logOut();
        dispatchStore(logoutFunction() as any);
        navigation.navigate("MainPage");
    };

    //Handle to search book page
    const handleSearchBook = () => {
        navigation.navigate("SearchBookScreen");
    }

    //Handle to add book page by admin
    const handleToAddBookPage = () => {
        navigation.navigate("AddBookScreen");
    }

    //Handle to manage loans by customer
    const handleToLoanPageByCustomer = () => {
        navigation.navigate("ManageLoanScreen");
    };

    //Handle to question management page for customers to admin
    const handleToQAndAPageByCustomer = () => {
        navigation.navigate("QuestionPageOfCustomers");
    };

    //Handle to manage q and a page by admin
    const handleToManageQAndAByAdmin = () => {
        navigation.navigate("ManageQuestionScreenByAdmin");
    };

    //Handle to manage users by admin

    const handleToManageUsersByAdmin = () => {
        navigation.navigate("ManageUserScreen");
    };
  
   


  return (
    <SafeAreaView style={styles.screen}>
    <View style={styles.mainContent}>
        <View style={styles.header}> 
            <View></View>
            {isAuthenticated && isAdmin ? (
                <View style={styles.badge}> 
                    <Text style={styles.textBadge}> Welcome admin with user id: {id}  </Text>
                </View>
            ) : 

            isAuthenticated && !isAdmin ? 
                (
                    <View style={styles.badge}>
                       <Text style={styles.textBadge}> Welcome customer with user id: {id} </Text>
                    </View>
                ) 
            :

            (
                <Text style={styles.mainTitle}> Welcome to Library! </Text>
            )
            }


            {!isAuthenticated && ( 
                <>
                <CommonButton onPress={() => handlePress("login")}> Log In </CommonButton>
                <CommonButton onPress={() => handlePress("registerAsAdmin")}> Register as admin </CommonButton>
                <CommonButton onPress={() => handlePress("register")}> Register as customer </CommonButton>
                </>
            )}

            {isAuthenticated && (
                <CommonButton onPress={handleLogOut}>
                    Log Out
                </CommonButton>
            )}

            {isAuthenticated && isAdmin && (
                <CommonButton onPress={handleToAddBookPage}>
                    Add book by admin
                </CommonButton>
            )}

            {(isAuthenticated && !isAdmin) && (
                <CommonButton onPress={handleToLoanPageByCustomer}>
                    Manage Loan And History
                </CommonButton>
            )}

            {(isAuthenticated && !isAdmin) && (
                <CommonButton onPress={handleToQAndAPageByCustomer}>
                    Manage questions delivered to admin!
                </CommonButton>
            )}

            {(isAuthenticated && isAdmin) && (
                <CommonButton onPress={handleToManageQAndAByAdmin}>
                    Manage Questions By Admin
                </CommonButton>
            )}

            {(isAuthenticated && isAdmin) && (
                  <CommonButton onPress={handleToManageUsersByAdmin}>
                    Manage Users By Admin
                </CommonButton>
            )}
           

            <CommonButton onPress={handleSearchBook}>
                Search Book
            </CommonButton>

            
        </View>
    </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.lightGreen
    },
    mainContent: {
        flex: 1,
        marginHorizontal: 15
    },
    header: {
       padding: 2,
      
    },
    badge: {
        padding: 5,
        backgroundColor: colors.yellow,
        borderRadius: 4,
        elevation: 4,
        shadowColor: "grey",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.45,
        shadowRadius: 4,
        marginVertical: 15
    },
    textBadge: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold"
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 24
    }
});

export default MainPage