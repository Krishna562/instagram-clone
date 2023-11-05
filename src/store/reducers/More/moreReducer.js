import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  isMoreDialogOpen: false,
  isDarkTheme: true,
};

const moreSlice = createSlice({
  name: "more",
  initialState: INITIAL_STATE,
  reducers: {
    setIsMoreDialogOpen: (state, action) => {
      state.isMoreDialogOpen = action.payload;
    },
    setIsDarkTheme: (state, action) => {
      state.isDarkTheme = action.payload;
    },
  },
});

export const { setIsMoreDialogOpen, setIsDarkTheme } = moreSlice.actions;

const moreReducer = moreSlice.reducer;
export default moreReducer;
