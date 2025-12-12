import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,         // resume object
  loading: false,     // for API calls
  error: null,        // error messages
  lastUpdated: null,  // timestamp
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.lastUpdated = Date.now();
    },

    updateResumeField: (state, action) => {
      if (state.data) {
        const { key, value } = action.payload;
        state.data[key] = value;   // Update a specific field
        state.lastUpdated = Date.now();
      }
    },

    removeResumeField: (state, action) => {
      if (state.data && action.payload in state.data) {
        delete state.data[action.payload];
        state.lastUpdated = Date.now();
      }
    },

    setResumeLoading: (state, action) => {
      state.loading = action.payload;
    },

    setResumeError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearResume: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    }
  },
});

export const {
  setResume,
  updateResumeField,
  removeResumeField,
  setResumeLoading,
  setResumeError,
  clearResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
