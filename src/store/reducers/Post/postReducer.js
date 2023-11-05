import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  isCreateModalOpen: false,
  currentPost: {},
  isCaptionSectionVisible: false,
  allPosts: [],
  editingPost: { isEditing: false, props: {}, postId: "" },
  tagDialog: {
    isOpen: false,
    position: { horizontal: 0, vertical: 0 },
  },
  tempTags: [],
  areTagsVisible: false,
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
    setEditingPost: (state, action) => {
      state.editingPost = action.payload;
    },
    setTagDialog: (state, action) => {
      state.tagDialog = action.payload;
    },
    setTempTags: (state, action) => {
      state.tempTags = action.payload;
    },
    setAreTagsVisible: (state, action) => {
      state.areTagsVisible = action.payload;
    },
  },
});

export const {
  setIsCreateModalOpen,
  setCurrentPost,
  setIsCaptionSectionVisible,
  setAllPosts,
  setEditingPost,
  setTagDialog,
  setTempTags,
  setAreTagsVisible,
} = postSlice.actions;

const postReducer = postSlice.reducer;

export default postReducer;
