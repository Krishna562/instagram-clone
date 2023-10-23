import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./User/userReducer";
import errReducer from "./Error/errReducer";
import postReducer from "./Post/postReducer";

const rootReducer = combineReducers({
  user: userReducer,
  error: errReducer,
  post: postReducer,
});

export default rootReducer;
