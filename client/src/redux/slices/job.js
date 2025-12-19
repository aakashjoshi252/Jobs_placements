import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    data: null,      // single job object
    loading: false,
    error: null,
  },
  reducers: {
    setJobLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setJob: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setJobError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearJob: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setJobLoading,
  setJob,
  setJobError,
  clearJob,
} = jobSlice.actions;

export default jobSlice.reducer;
