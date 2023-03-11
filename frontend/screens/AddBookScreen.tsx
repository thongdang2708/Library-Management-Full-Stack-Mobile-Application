
import React, { useContext, useRef, useState } from 'react';
import {View, Text, KeyboardAvoidingView, Platform, Pressable} from "react-native";
import { useEffect } from 'react';
import AuthContext from '../store/context/AuthContext';
import { useSelector } from 'react-redux';
import { dispatchStore, RootState } from '../store/redux/store';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import { StyleSheet } from 'react-native';
import Input from '../components/Input';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { fetchAllCategories } from '../store/redux/actions/CategoryActions';
import colors from '../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonForForm from '../ui/ButtonForForm';
import { SelectList } from 'react-native-dropdown-select-list';
import path from "path";
import {Picker} from '@react-native-picker/picker';
import { resetFunction } from '../store/redux/actions/ProductActions';
import { addBook } from '../store/redux/actions/ProductActions';






interface isValidProps {
    name: undefined | boolean,
    author: undefined | boolean,
    image: undefined |boolean ,
    category: undefined | boolean,
    quantity: undefined | boolean,
    borrowLength: undefined | boolean
}

interface FileUpload {
    uri: string | Blob,
    type: string,
    name: string
}

function AddBookScreen() {
  
    //Get auth context
    let {isAuthenticated, token, id} = useContext(AuthContext);

    //Get auth from redux
    let {isAdmin} = useSelector((state: RootState) => state.user);

    //Get categories from redux
    let {category} = useSelector((state : RootState) => state.category);

    //Get books from redux
    let {isSuccess, isError, message} = useSelector((state : RootState) => state.book);

    //Set state for drop down categories
    const [selectedCategory, setSelectedCategory] = useState("");
    const dataCategory = category.map((item : string, index : number) => ({
        key: (index+1).toString(),
        label: item.includes("_") ? item.replace("_","") : item,
        value: item
    }));


    //Set navigation
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Set effect to check admin
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigation.navigate("MainPage");
        }
    },[isAuthenticated, isAdmin]);



    //Set input state
    let [inputs, setInputs] = useState({
        name: "",
        author: "",
        category: "",
        quantity: "",
        borrowLength: ""
    }); 

    

    //Set image state
    const [selectedImage, setSelectedImage] = useState<any>("");

    

    //Set is valid state
    let [isValid, setIsValid] = useState<isValidProps>({
        name: undefined,
        author: undefined,
        image: undefined,
        category: undefined,
        quantity: undefined,
        borrowLength: undefined
    });

    //Open image picker

    const handleChoosePhoto = async () => {
         // No permissions request is necessary for launching the image library
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });


          if (!result.canceled) {
              setSelectedImage(result.assets[0])
          }
      };
    
      //Create file name automatically
      const generateFileName = (): string => {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${timestamp}_${randomString}`;
      };

      //Set function to toast
      const showToast = (type: string, text: string) => {
          Toast.show({
              type: type,
              text1: text
          })
      }

     
      //Handle change for inputs

      const handleChange = (key: string, text : string) => {

        setInputs((value) => {
            return {
                ...value,
                [key]: text
            }
        })
      };
      
      //Fetch all categories
      useEffect(() => {
        dispatchStore(fetchAllCategories() as any);
      }, []);
      console.log(selectedImage);

      //Handle Change Caterogy

      console.log(selectedCategory);

      //Handle submit to add book
     
      const handleSubmit = () => {

        let data = {
            name: inputs.name,
            author: inputs.author,
            category: selectedCategory,
            quantity: parseInt(inputs.quantity),
            borrowLength: parseInt(inputs.borrowLength)
        }

        let imageIsValid = typeof(selectedImage) != "string";
        let nameIsValid = data.name.length > 0;
        let authorIsValid = data.author.length > 0;
        let categoryIsValid = data.category.length > 0;
        let quantityIsValid = data.quantity > 0;
        let borrowLengthIsValid = data.borrowLength > 0;

        if (!imageIsValid || !nameIsValid || !authorIsValid || !quantityIsValid || !borrowLengthIsValid || !categoryIsValid) {


            setIsValid((state) => {
          
                    return {
                        name: nameIsValid,
                        author: authorIsValid,
                        image: imageIsValid,
                        category: categoryIsValid,
                        quantity: quantityIsValid,
                        borrowLength: borrowLengthIsValid
                    }
                
            });

            showToast("error", "There are missing inputs!");

            setTimeout(() => {
                setIsValid((state) => {
          
                    return {
                        name: undefined,
                        author: undefined,
                        image: undefined,
                        category: undefined,
                        quantity: undefined,
                        borrowLength: undefined
                    }
                
            });
            }, 3000);
            setSelectedImage("");
            setSelectedCategory("");
           
            return;
        }

        const formData = new FormData();
        
        //Get extension name 

      
        let fileUpload : FileUpload = {
            uri: selectedImage?.uri,
            type: selectedImage?.type == "image" ? path.extname(selectedImage.uri).replace(".", "") : "",
            name: generateFileName() + path.extname(selectedImage.uri)
        };

        console.log(data.category);

        formData.append("file", fileUpload as any);
        formData.append("name", data.name);
        formData.append("author", data.author);
        formData.append("category", data.category);
        formData.append("urlImage", "");
        formData.append("quantity", data.quantity as any);
        formData.append("createdAt", "");
        formData.append("borrowLength", data.borrowLength as any);

        dispatchStore(addBook(id as number, token as string, formData) as any);
        showToast("success", "You uploaded book successfully!");
        console.log(formData);

        setInputs((value) => {
            return {
                name: "",
                author: "",
                category: "",
                quantity: "",
                borrowLength: ""
            }
        });
        setSelectedImage("");
        setSelectedCategory("");
        

      };


      //Set effect when adding book
      useEffect(() => {

        if (isSuccess) {
            navigation.navigate("MainPage");
        } else if (isError) {
            showToast("error", message);
        }
        dispatchStore(resetFunction() as any);
      },[isSuccess, navigation, isError, message]);


    if (Platform.OS === "android") {
        return (
            <ScrollView style={{flex: 1, marginBottom: 10, backgroundColor: colors.grey}}>
            <KeyboardAvoidingView style={{flex: 1, marginBottom: 10, backgroundColor: colors.grey}}>
            <View style={styles.screen}>
               <Text style={styles.title}> Add Book Screen By Admin </Text>
        
               <View style={styles.form}>
                    <Input name='Book Name' textInputConfig={{
                        placeholder: "Enter a book name",
                        autoCorrect: false,
                        autoCapitalize: "none",
                        maxLength: 50,
                        value: inputs.name,
                        onChangeText: (text : string) => handleChange("name", text)
                    }} isValid={isValid.name == false} textInValid={"Name must not be blank!"}/>
        
                <View style={styles.fileUpload}>
                <Text style={styles.minorTitle}> Upload file: </Text>
        
                {typeof(selectedImage) == "string" ? 
            (   
                <>
                <TouchableOpacity onPress={handleChoosePhoto}>
                <Text style={styles.minorTitleForImageUpload}>Select File</Text>
                 </TouchableOpacity>
                {isValid.image == (undefined || null || false) && (<Text style={{color: colors.red, textAlign: "center", fontSize: 24, fontWeight: "bold"}}> File is not uploaded! </Text>)}
                </>
            )
            
            :
    
            (   
                <>
                <Pressable onPress={() => setSelectedImage("")}>
                <Text style={styles.minorTitleForImageUpload}> Your image file is uploaded! </Text>
                </Pressable>
                <Text style={styles.noticeText}> Please enter again in the above button to select file again! </Text>
                </>
            )
        }   
                <Input name='Author' textInputConfig={{
                        placeholder: "Enter an author",
                        autoCorrect: false,
                        autoCapitalize: "none",
                        maxLength: 50,
                        value: inputs.author,
                        onChangeText: (text : string) => handleChange("author", text)
                    }} isValid={isValid.name == false} textInValid={"Author must not be blank!"}/>


                <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue, itemIndex) =>
                setSelectedCategory(itemValue)
                }>
                <Picker.Item key={0} label="Select Option As Below" value=""></Picker.Item>
                {category.map((item : string, index: number) => (
                <Picker.Item key={index+1} label={item.includes("_") ? item.replace("_", " ") : item} value={item}></Picker.Item>
                ))}
            </Picker> 
                {isValid.category == (undefined || null || false) && (<Text style={{color: colors.red, textAlign: "left", fontSize: 16, fontWeight: "bold", marginVertical: 12}}> Category must be selected! </Text>)}
                
                <Input name='Quantity' textInputConfig={{
                    placeholder: "Enter a quantity",
                    keyboardType: "number-pad",
                    value: inputs.quantity,
                    onChangeText: (text : string) => handleChange("quantity", text)
                }} isValid={isValid.name == false} textInValid={"Quantity must not be zero"}/>
            
                <Input name='Length to borrow (days)' textInputConfig={{
                    placeholder: "Enter a borrow length",
                    keyboardType: "number-pad",
                    value: inputs.borrowLength,
                    onChangeText: (text : string) => handleChange("borrowLength", text)
                }} isValid={isValid.name == false} textInValid={"Quantity must not be zero"}/>
                
                <ButtonForForm onPress={handleSubmit}>
                    Add Book
                </ButtonForForm>
                
                </View>
               </View>
        
               
            </View>
            </KeyboardAvoidingView>
            </ScrollView>
          )
    } 
    
    return (    
        <KeyboardAwareScrollView style={{flex: 1, backgroundColor: colors.grey}} extraHeight={120}>
        <View style={styles.screen}>
           <Text style={styles.title}> Add Book Screen By Admin </Text>
    
           <View style={styles.form}>
                <Input name='Book Name' textInputConfig={{
                    placeholder: "Enter a book name",
                    autoCorrect: false,
                    autoCapitalize: "none",
                    maxLength: 50,
                    value: inputs.name,
                    onChangeText: (text : string) => handleChange("name", text)
                }} isValid={isValid.name == false} textInValid={"Name must not be blank!"}/>
    
            <View style={styles.fileUpload}>
            <Text style={styles.minorTitle}> Upload file: </Text>
    
            {typeof(selectedImage) == "string" ? 
            (   
                <>
                <TouchableOpacity onPress={handleChoosePhoto}>
                <Text style={styles.minorTitleForImageUpload}>Select File</Text>
                 </TouchableOpacity>
                {isValid.image == (undefined || null || false) && (<Text style={{color: colors.red, textAlign: "center", fontSize: 24, fontWeight: "bold"}}> File is not uploaded! </Text>)}
                </>
            )
            
            :
    
            (     
                <>
                <Pressable onPress={() => setSelectedImage("")}>
                <Text style={styles.minorTitleForImageUpload}> Your image file is uploaded! </Text>
                </Pressable>
                  <Text style={styles.noticeText}> Please enter again in the above button to select file again! </Text>
                </>
            )
        }   
    
            <Input name='Author' textInputConfig={{
                    placeholder: "Enter an author",
                    autoCorrect: false,
                    autoCapitalize: "none",
                    maxLength: 50,
                    value: inputs.author,
                    onChangeText: (text : string) => handleChange("author", text)
                }} isValid={isValid.name == false} textInValid={"Author must not be blank!"}/>
            
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) =>
            setSelectedCategory(itemValue)

            }>
            <Picker.Item key={0} label="Select Option As Below" value=""></Picker.Item>
            {category.map((item : string, index: number) => (
            <Picker.Item key={index+1} label={item.includes("_") ? item.replace("_", " ") : item} value={item}></Picker.Item>
             ))}
            </Picker> 
            
             {isValid.category == (undefined || null || false) && (<Text style={{color: colors.red, textAlign: "left", fontSize: 16, fontWeight: "bold", marginVertical: 12}}> Category must be selected! </Text>)}
    
            <Input name='Quantity' textInputConfig={{
                    placeholder: "Enter a quantity",
                    keyboardType: "number-pad",
                    value: inputs.quantity,
                    onChangeText: (text : string) => handleChange("quantity", text)
                }} isValid={isValid.name == false} textInValid={"Quantity must not be zero"}/>
            
            <Input name='Length to borrow (days)' textInputConfig={{
                    placeholder: "Enter a borrow length",
                    keyboardType: "number-pad",
                    value: inputs.borrowLength,
                    onChangeText: (text : string) => handleChange("borrowLength", text)
                }} isValid={isValid.name == false} textInValid={"Quantity must not be zero"}/>
                
            <ButtonForForm onPress={handleSubmit}>
                    Add Book
            </ButtonForForm>
            
            </View>
           </View>
    
           
        </View>
        </KeyboardAwareScrollView>
      )
 
  
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.grey
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold"
    },
    form: {
        marginVertical: 20
    },
    fileUpload: {
        marginVertical: 20
    },
    minorTitle: {
        marginVertical: 5,
        fontSize: 15,
        fontWeight: "bold",
    },
    minorTitleForImageUpload: {
        padding: 5,
        borderRadius: 10,
        backgroundColor: colors.yellow,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        borderWidth: 2
    },
    noticeText: {
        textAlign: "center",
        marginVertical: 20, 
        color: colors.green,
        fontSize: 20,
        fontWeight: "bold"
    }
});

export default AddBookScreen