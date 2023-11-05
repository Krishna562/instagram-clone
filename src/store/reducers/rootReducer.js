import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./User/userReducer";
import errReducer from "./Error/errReducer";
import postReducer from "./Post/postReducer";
import moreReducer from "./More/moreReducer";

const rootReducer = combineReducers({
  user: userReducer,
  error: errReducer,
  post: postReducer,
  more: moreReducer,
});

export default rootReducer;
