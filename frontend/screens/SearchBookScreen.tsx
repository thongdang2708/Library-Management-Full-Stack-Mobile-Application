
import React from 'react';
import { useState } from 'react';
import {View, Text} from "react-native";
import { page_size } from '@env';
import { TextInput } from 'react-native';
import CommonIconButton from '../ui/CommonIconButton';
import { StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fetchAllCategories } from '../store/redux/actions/CategoryActions';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { dispatchStore, RootState } from '../store/redux/store';
import { getAllBookOnFilter, getAllBookOnKeywords, getAllBooks, getAllPaginationBooks } from '../store/redux/actions/ProductActions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../App';
import SingleBook from '../components/single_item_component/SingleBook';
import {Picker} from '@react-native-picker/picker';
import { Book } from '../store/redux/reducers/ProductReducer';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ListRenderItem } from 'react-native';
import CommonButton from '../ui/CommonButton';


function SearchBookScreen() {

    //Set page size and offset
    let pageSize = parseInt(page_size);
    let [offset, setOffset] = useState(1);

    //Get search input
    let [searchInput, setSearchInput] = useState("");

    //Set navigation 
    let navigation = useNavigation<StackNavigationProp<RootParamList>>();

    //Get book from redux
    let {books, paginatedBooks} = useSelector((state: RootState) => state.book);

    //Get categories from redux
    let {category} = useSelector((state: RootState) => state.category);

    //Set category input
    let [selectedCategory, setSelectedCategory] = useState("");


    //Fetch all categories
    useEffect(() => {
        dispatchStore(fetchAllCategories() as any);
      }, []);
   
    //Set effect to fetch books
    useEffect(() => {
        dispatchStore(getAllBooks() as any);
    },[books.length]);


    //Set effect to display paginated books
    useEffect(() => {

        if (searchInput.length > 0 && selectedCategory.length == 0) {
            dispatchStore(getAllBookOnKeywords(offset-1, pageSize, searchInput) as any);
           
        } else if (searchInput.length == 0 && selectedCategory.length > 0) {
            dispatchStore(getAllBookOnFilter(offset-1, pageSize, selectedCategory) as any);
           
        } else if (searchInput.length == 0 && selectedCategory.length == 0) {
            dispatchStore(getAllBooks() as any);
            dispatchStore(getAllPaginationBooks(offset-1, pageSize) as any);
        }

    },[searchInput, selectedCategory, offset, pageSize]);


    //Total page 
    let totalPage = Math.ceil(books.length / pageSize);

     //Set effect when there are no items in a certain page
     useEffect(() => {

        if (paginatedBooks.length == 0 && offset > 1) {
            setOffset((value) => value - 1);
        }

    }, [paginatedBooks, offset, books]);

     //Handle convertion from string to number
     const convertString = (value : number) => {

        let offsetString = "";
        offsetString += value;

        return offsetString;
    }

     //Function to handle change for input
     const handleChange = (text : string) => {
        let offsetNumber = parseInt(text);

        if (offsetNumber <= 1) {
            setOffset(1);
        } else if (offsetNumber > totalPage && totalPage !== 0) {
            setOffset(totalPage);
        } else {
            setOffset(offsetNumber);
        }
    };

    //Function to decrease offset
    const handleBackNumber = () => {
        offset--;

        if (offset <= 1) {
            setOffset(1);
        } else {
            setOffset((value) => value - 1);
        }
    }

    //Function to increase offset

    const handleMoveNumber = () => {
        offset++;

        if (offset > totalPage && totalPage !== 0) {
            setOffset(totalPage);
        } else {
            setOffset((value) => value + 1);
        }
    };


    //Function to handle change search input
    const handleChangeSearchInput = (text : string) => {
        setSearchInput(text);
        setSelectedCategory("");
    }

    //Function to handle first or last page
    const handleFirstOrLastPage = (text : string) => {
        if (text === "first") {
            setOffset(1);
        } else if (text === "last") {
            setOffset(totalPage);
           
        }
    }



    //Function to handle single item

    const handleSingleItem : ListRenderItem<Book> = ({item} : any) => {
        
        return <SingleBook {...item}/>
    };

   

  return (
    // <ScrollView style={styles.screen}>
    <View style={styles.screen}>

            <Text style={styles.title}> List of books  </Text>

            <TextInput placeholder='Enter your search...' style={styles.searchInput} value={searchInput} autoCapitalize="none" autoCorrect={false} onChangeText={(text : string) => handleChangeSearchInput(text)}/>
            <Text style={styles.minorTitle}> Select books based on category as box below! </Text>
            <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedCategory(itemValue)
                        setSearchInput("");
                    }
                }>
                <Picker.Item key={0} label="Select Option As Below" value=""></Picker.Item>
                {category.map((item : string, index: number) => (
                <Picker.Item key={index+1} label={item.includes("_") ? item.replace("_", " ") : item} value={item}></Picker.Item>
                ))}
            </Picker> 

            <View style={styles.buttonsContainer}>

            <CommonIconButton name={"caret-back-outline"} color={"black"} size={20} width={50} backgroundColor={colors.neon} onPress={handleBackNumber}/>
            
            <View style={styles.inputContainer}>
            <TextInput value={convertString(offset)} keyboardType="number-pad" onChangeText={(text : string) => handleChange(text)}/>
            </View>

            <CommonIconButton name={"caret-forward-outline"} color={"black"} size={20} width={50} backgroundColor={colors.neon} onPress={handleMoveNumber}/>
            
            </View>

            <View style={styles.secondButtonsContainer}>
            <CommonButton onPress={() => handleFirstOrLastPage("first")}> First Page </CommonButton>
            <CommonButton onPress={() => handleFirstOrLastPage("last")}> Last Page </CommonButton>
            </View>
            
            <View style={styles.list}>
                <FlatList data={paginatedBooks} renderItem={handleSingleItem} keyExtractor={(item : any, index : any) => {
                    return item.id
                }}/>
            </View>


          

    </View>
    // </ScrollView>
  )
}

const styles = StyleSheet.create({
     screen: {
         flex: 1,
         backgroundColor: colors.skinColor
     },
     searchInput: {
        marginHorizontal: 24,
        padding: 14, 
        borderWidth: 2, 
        borderRadius: 10,
     },
    inputContainer: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        backgroundColor: colors.grey,
        borderRadius: 5,
        borderWidth: 2
        
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20 
    },
    title: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20
    },
    minorTitle: {
        textAlign: "left",
        marginHorizontal: 20,
        marginTop: 5,
        fontWeight: "bold",
        fontSize: 16
    },
    list: {
        marginHorizontal: 20
    },
    secondButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    errorText: {
        textAlign: "center",
        color: colors.red,
        marginVertical: 40,
        fontSize: 20,
        fontWeight: "bold"
    }
    
});

export default SearchBookScreen