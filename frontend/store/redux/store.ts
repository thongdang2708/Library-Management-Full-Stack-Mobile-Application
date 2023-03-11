
import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import { categoryReducers } from "./reducers/CategoryReducer";
import { userReducers } from "./reducers/UserReducer";
import { bookReducers } from "./reducers/ProductReducer";
import { commentReducers } from "./reducers/CommentReducer";
import { checkoutReducers } from "./reducers/CheckoutReducer";
import { historyReducers } from "./reducers/HistoryReducer";
import { customerReducers } from "./reducers/CustomerReducer";
import { questionReducers } from "./reducers/QuestionReducer";
const middleware = [thunk];

const reducers = combineReducers({
    user: userReducers,
    category: categoryReducers,
    book: bookReducers,
    checkout: checkoutReducers,
    history: historyReducers,
    comment: commentReducers,
    quiz: questionReducers,
    customer: customerReducers
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middleware)));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const dispatchStore = store.dispatch;