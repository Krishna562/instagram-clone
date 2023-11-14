import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  currentUser: {},
  allUsers: [],
  isLoggedIn: false,
  allUserPosts: [],
  specificUser: {},
  isSearchbarVisible: false,
  searchBtnRef: null,
  willHideNotifBar: false,
  isNotifBarVisible: false,
  notifBtnRef: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    checkAuthStatus: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setAllUserPosts: (state, action) => {
      state.allUserPosts = action.payload;
    },
    setSpecificUser: (state, action) => {
      state.specificUser = action.payload;
    },
    setIsSearchbarVisible: (state, action) => {
      state.isSearchbarVisible = action.payload;
    },
    setIsNotifBarVisible: (state, action) => {
      state.isNotifBarVisible = action.payload;
    },
    setSearchBtnRef: (state, action) => {
      state.searchBtnRef = action.payload;
    },
    setWillHideNotifBar: (state, action) => {
      state.willHideNotifBar = action.payload;
    },
    setNotifBtnRef: (state, action) => {
      state.notifBtnRef = action.payload;
    },
  },
});

export const {
  setCurrentUser,
  setAllUsers,
  checkAuthStatus,
  setAllUserPosts,
  setSpecificUser,
  setIsSearchbarVisible,
  setSearchBtnRef,
  setIsNotifBarVisible,
  setNotifBtnRef,
  setWillHideNotifBar,
} = userSlice.actions;

const userReducer = userSlice.reducer;

export default userReducer;
