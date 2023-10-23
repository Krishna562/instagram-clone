import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  isCreateModalOpen: false,
  currentPost: {},
  isCaptionSectionVisible: false,
  allPosts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState: INITIAL_STATE,
  reducers: {
    setIsCreateModalOpen: (state, action) => {
      state.isCreateModalOpen = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setIsCaptionSectionVisible: (state, action) => {
      state.isCaptionSectionVisible = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
  },
});

export const {
  setIsCreateModalOpen,
  setCurrentPost,
  setIsCaptionSectionVisible,
  setAllPosts,
} = postSlice.actions;

const postReducer = postSlice.reducer;

export default postReducer;
