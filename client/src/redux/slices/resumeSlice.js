import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    data: null, // will store resume object
  },
  reducers: {
    setResume: (state, action) => {
      state.data = action.payload;
    },
    clearResume: (state) => {
      state.data = null;
    },
  },
});

export const { setResume, clearResume } = resumeSlice.actions;
export default resumeSlice.reducer;