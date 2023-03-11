
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import {View, Text, StyleSheet, Image, Alert} from "react-native";
import { useSelector } from 'react-redux';
import { getSingleBook } from '../../store/redux/actions/ProductActions';
import { dispatchStore } from '../../store/redux/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../App';
import AuthContext from '../../store/context/AuthContext';
import { RootState } from '../../store/redux/store';
import { WEB_URL } from '@env';
import colors from '../../constants/colors';
import CommonButton from '../../ui/CommonButton';
import { Modal } from 'react-native';
import { useState } from 'react';
import { Button } from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { useWindowDimensions } from 'react-native';
import { ListRenderItem } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { checkBookIsBorrowed, checkoutBook, fetchCount, resetAfterBorrowing } from '../../store/redux/actions/CheckoutActions';
import Input from '../Input';
import { Picker } from '@react-native-picker/picker';
import { addComment, checkReview, deleteReview, fetchAllComments, InputComment } from '../../store/redux/actions/CommentActions';
import CommonIconButton from '../../ui/CommonIconButton';

function SingleBookDisplay({route} : any) {

    //Set width and height of screen

    const width = useWindowDimensions().width;
    const height = useWindowDimensions().height;

    //Get param id
    let bookId = route.params?.id;


    //Set function to toast
    const showToast = (type: string, text: string) => {
        Toast.show({
            type: type,
            text1: text
        })
    }



    //Set modal state for adding a comment
    let [modalAddComment, setModalAddComment] = useState(false);
    

    //Set modal state for showing comments
    let [modalIsVisible, setModalIsVisible] = useState(false);
    
    //Set effect to fetch single book display
    useEffect(() => {
        dispatchStore(getSingleBook(bookId) as any);
    },[bookId]);

      //Get auth context
      let {isAuthenticated, id, token} = useContext(AuthContext);

      //Set navigation
      let navigation = useNavigation<StackNavigationProp<RootParamList>>();
      
      //Set state for rating score
      let [rating, setRating] = useState(0);

      //Set state for description of comment
      let [description, setDescription] = useState("");
      let [descriptionValid, setDescriptionValid] = useState(true);

      //Get state for comment from redux
      let {comments, isCommented} = useSelector((state : RootState) => state.comment);
  
      //Get auth from redux
      let {isAdmin} = useSelector((state: RootState) => state.user);

      //Get checkouts from redux
      let {isBorrowed, isSuccess, isError, message, numberOfCheckouts, maxCheckouts} = useSelector((state: RootState) => state.checkout);
    
      //Get single book from redux
      let {book} = useSelector((state: RootState) => state.book);

    
      //Handle back to main page for unauthorized customer
      const handleBackToMainPage = () => {
          navigation.navigate("MainPage");
      };

      //Set effect when borrowing
      useEffect(() => {

        if (isSuccess) {
            showToast("success", "You borrow this book successfully!")
        } else if (isError) {
            showToast("error", message);
        }
        dispatchStore(resetAfterBorrowing() as any);

      }, [isSuccess, isError, message]);

      //Set effect to fetch comments

      useEffect(() => {
        dispatchStore(fetchAllComments(bookId) as any);
      },[bookId]);


      //Set effect when counting

      useEffect(() => {

        if (isAuthenticated && !isAdmin) {
            dispatchStore(fetchCount(id as number, token as string) as any);
        }
      },[id, token, numberOfCheckouts,isAuthenticated, isAdmin]);
     
      //Borrow book function
      const borrowTheBook = () => {
        dispatchStore(checkoutBook(id as number, bookId, token as string) as any);
      };

      //Handle borrow function for customers

      const handleBorrowBookForCustomer = () => {
        Alert.alert("Let\t's borrow this book", "Are you sure to borrow this book?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel to borrow this book!"),
                style: "cancel"
            },
            {
                text: "OK to borrow this book",
                onPress: borrowTheBook,
            }
        ]);
      }

    //Handle toggle modal
    const toggleModal = () => {
        setModalIsVisible(!modalIsVisible);
    };

    //Calculate total reviews
    let gradesOfBook = comments.map((item: any) => item.grade);
    let totalReviewOfBook = gradesOfBook.reduce((acc: any, ele: any) => acc += ele, 0)/gradesOfBook.length;
    
    //Constant star variable
    let starSize = 24;

      //Set array for rating

      const arrayOfRatings = () => {
        
        let arrayRatings : number[] = [];
        for (let i=0; i<=5; i+=0.5) {
            arrayRatings.push(i);
        }

        return arrayRatings;
    }

    //Handle to submit review

    const handleSubmitReview = () => {

        let inputReview : InputComment = {
            description: description,
            grade: rating
        };

        let descriptionIsValid = description.length > 0;

        if (!descriptionIsValid) {

            setDescriptionValid(false);

            setTimeout(() => {
                setDescriptionValid(true);
            }, 3000);

            return;
        }

        dispatchStore(addComment(id as number, bookId, token as string, inputReview) as any);
        setModalAddComment(false);
        setRating(0);
        setDescription("");
    
    }

    //Check book is borrowed
    useEffect(() => {
        
        if (isAuthenticated && !isAdmin && token) {
            dispatchStore(checkBookIsBorrowed(id as number, bookId, token as string) as any);
        }
    },[isAuthenticated, isAdmin, bookId, id, token]);

    //Check book is commented by customer

    useEffect(() => {

        if (isAuthenticated && !isAdmin) {
            dispatchStore(checkReview(id as number, bookId, token as string) as any);
        }

    },[isAuthenticated, isAdmin, token, bookId, id]);

   


    //Render comments
    const renderComments = ({item, index} : any) => {

         //Handle delete review
        const handleDelete = () => {
            dispatchStore(deleteReview(token as string, item.id) as any);
        }
        
        console.log(id, item.userIdForReview);
        return (
            <View style={styles.singleComment}>

                {(isAuthenticated && isAdmin) && (
                    <View style={styles.iconContainer}>
                    <CommonIconButton name={"close-outline"} color={colors.red} backgroundColor={colors.lightPink} size={12} width={width / 10} onPress={handleDelete} />
                    </View>
                )}
                <Text style={styles.textComment}> {item.description} </Text>

                <Text style={styles.textComment}> {(id != (null || undefined) && id === item.userIdForReview) ? "You commented on this book!" : `${item.username} commented on this book`} </Text>

                <View style={styles.starContainer}>
                    <View>
                    {item.grade >= 1 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 0.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow} size={starSize}/>}
                    </View>
                    <View>
                    {item.grade >= 2 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 1.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {item.grade >= 3 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 2.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {item.grade >= 4 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 3.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {item.grade >= 5 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 4.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
            </View>
            </View>
        )
    }


  return (
    <View style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.productInformation}>
           <View style={styles.imageContainer}>
            <Image source={{uri: WEB_URL + "/api/v1/books/readFile/" + book.urlImage}} style={styles.image}/>
           </View>

           <View style={styles.bookInfo}>
            <Text style={styles.minorTitle}> {book.name}</Text>
            <Text style={styles.minorTitle}> Quantity: {book.quantity} </Text>
            <Text style={styles.minorTitle}> Available Quantity: {book.availableQuantity} </Text>
            <View style={styles.starContainer}>
                    <View>
                    {totalReviewOfBook >= 1 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 0.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow} size={starSize}/>}
                    </View>
                    <View>
                    {totalReviewOfBook >= 2 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 1.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {totalReviewOfBook >= 3 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 2.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {totalReviewOfBook >= 4 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 3.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
                    <View>
                    {totalReviewOfBook >= 5 ? <MaterialIcons name={"star"} color={colors.yellow} size={starSize}/> : totalReviewOfBook === 4.5 ?  <Ionicons name={"star-half-outline"} color={colors.yellow} size={starSize}/> : <Ionicons name={"star-outline"} color={colors.yellow}  size={starSize}/>}
                    </View>
            </View>
           </View>
        </View>

        <View style={styles.loanInformation}>
            <View style={styles.loanContainer}>
                <Text style={styles.loanTextTitle}> Loan Information: </Text>

                {(isAuthenticated && !isAdmin && numberOfCheckouts <= maxCheckouts) && (
                    <View style={[styles.errorContainer, {backgroundColor: colors.green, maxWidth: width / 2}]}>
                        <Text style={[styles.errorText, {textAlign: "left"}]}> Your total check-out books:</Text>
                        <Text style={[styles.errorText, {textAlign: "left"}]}> {numberOfCheckouts} / {maxCheckouts} </Text>
                    </View>
                )}

                {(isAuthenticated && !isAdmin && numberOfCheckouts > maxCheckouts) && (
                    <View style={[styles.errorContainer, {maxWidth: width / 2}]}>
                        <Text style={[styles.errorText, {textAlign: "left"}]}> Your total check-out books: </Text>
                        <Text style={[styles.errorText, {textAlign: "left"}]}> {numberOfCheckouts} / {maxCheckouts} </Text>
                        <Text style={[styles.errorText, {textAlign: "left"}]}> You cannot borrow more books! </Text>
                    </View>
                )}  

                {!isAuthenticated && (
                    <CommonButton onPress={handleBackToMainPage}>
                        You are not signed in! Not allowed to borrow this book! Please go back to main page by pressing this button!
                    </CommonButton>
                )}

                {(isAuthenticated && isAdmin) && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}> You are an admin! Not allowed to borrow this book! </Text>
                    </View>
                )}

                {(isAuthenticated && !isAdmin && !isBorrowed) && (
                    <CommonButton onPress={handleBorrowBookForCustomer}>
                        Please click on this button to borrow the book!
                    </CommonButton>
                )}

                {(isAuthenticated && !isAdmin && isBorrowed) && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}> You borrowed this book already! </Text>
                    </View>
                )}

            </View>

            {(isAuthenticated && !isAdmin) && (

                <>
                {!isCommented ? 
                (
                    <CommonButton onPress={() => setModalAddComment(!modalAddComment)}> Click to add comment! </CommonButton>
                )
            
                :
                (
                    <View style={[styles.errorContainer, {marginHorizontal: 10}]}>
                        <Text style={[styles.errorText]}> You already commented on this book! Therefore you cannot add more comments!  </Text>
                    </View>
                )
                }
           
                </>
            )}
            
            <CommonButton onPress={toggleModal}> Open to see comments! </CommonButton>

            <Modal
            animationType="fade"
            transparent={true}
            visible={modalAddComment}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalAddComment(!modalAddComment);
            }}
            >
           <View style={styles.modalScreen}>
            <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}> Add comment form! </Text>

            <View style={styles.formGroup}>
                <Picker 
                selectedValue={rating}
                onValueChange={(itemValue, itemIndex) =>
                setRating(itemValue)}>
                    {arrayOfRatings().map((number : number) => (
                        <Picker.Item label={number.toString() + " stars"} key={number} value={number}/>
                    ))}
                </Picker>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.labelTitle}> Description: </Text>
                <TextInput placeholder='Enter your description' autoCorrect={false} autoCapitalize="none" multiline={true} style={[styles.descriptionInput, {height: height / 4}, !descriptionValid && {borderColor: colors.red}]} value={description} onChangeText={(text : string) => setDescription(text)}/> 

                {!descriptionValid && (<Text style={[styles.errorText, {color: colors.red}]}> Description must not be blank! </Text>)}
            </View>

            <CommonButton onPress={handleSubmitReview}> Submit a review! </CommonButton>            
            <CommonButton onPress={() => setModalAddComment(!modalAddComment)}> Close to add comment form </CommonButton>
            </View>
            </View>
            </Modal>

            
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
            <Text style={styles.modalTitle}> List of comments</Text>
            
            {comments.length > 0 
            
            ? 
            (   
                <View style={styles.list}>
                <FlatList data={comments} renderItem={renderComments} keyExtractor={(item: any, index: any) => item.id}/>
                </View>
            )
            
            :

            (
                <Text style={[styles.errorText, {color: colors.red, fontWeight: "bold", marginVertical: 50, fontSize: 18}]}> There are no comments for this book! </Text>
            )
            }
          
           
            <CommonButton onPress={toggleModal}> Close to see comments! </CommonButton>
            </View>
            </View>
            </Modal>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.skinColor
    },
    body: {
        flex: 1,
        marginHorizontal: 10
    },
    productInformation: {
        flex: 1,
        padding: 10,
        borderWidth: 2,
        borderRadius: 4, 
        marginVertical: 10,
        elevation: 4,
        shadowColor: "grey",
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.45,
        flexDirection: "row",
        backgroundColor: colors.offWhite
    },
    imageContainer: {
        flex: 1
    },
    bookInfo: {
        flex: 1,
        padding: 5
    },
    image: {
        resizeMode: "cover",
        height: "100%",
        width: "100%"
    },
    loanInformation: {
        flex: 2,
        marginVertical: 10,
        padding: 5,
        
    },
    minorTitle: {
        marginVertical: 10,
        fontWeight: "bold",
    },
    loanContainer: {

    },
    loanTextTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 10
    },
    errorContainer: {
        padding: 5,
        backgroundColor: colors.red,
        borderWidth: 2, 
        borderRadius: 4,
        marginVertical: 8
    },
    errorText: {
        textAlign: "center",
        fontWeight: "bold"
    },
    modalScreen: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContainer: {
        padding: 5, 
        backgroundColor: "white",
        flex: 0.8,
        width: "85%",
        borderWidth: 2,
        borderRadius: 5
    },
    modalTitle: {
        textAlign: "center",
        marginVertical: 10,
        fontWeight: "bold",
        fontSize: 20
    },
    starContainer: {
        flexDirection: "row"
    },
    singleComment: {
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 5,
        backgroundColor: colors.grey,
        borderWidth: 2,
        borderRadius: 2
    },
    addCommentForm: {
        marginVertical: 10
    },
    formGroup: {
        marginVertical: 20
    },
    labelTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    descriptionInput: {
        textAlignVertical: "top",
        padding: 10,
        borderWidth: 2, 
        marginHorizontal: 5,
        marginVertical: 20,
        borderRadius: 10
    },
    textComment: {
        fontSize: 14,
        fontWeight: "bold",
        marginVertical: 5
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    list: {
        marginTop: 12,
        marginBottom: 80
    }
    
});

export default SingleBookDisplay