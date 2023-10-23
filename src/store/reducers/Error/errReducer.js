import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  err: {},
};

const errSlice = createSlice({
  name: "err",
  initialState: INITIAL_STATE,
  reducers: {
    setErr: (state, action) => {
      state.err = action.payload;
    },
  },
});

export const { setErr } = errSlice.actions;

const errReducer = errSlice.reducer;

export default errReducer;
