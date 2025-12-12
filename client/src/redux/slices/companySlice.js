import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    data: null,       
    loading: false,   
    error: null, 
  },
  reducers: {
    setCompanyLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCompany: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCompanyError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCompany: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCompanyLoading,
  setCompany,
  setCompanyError,
  clearCompany,
} = companySlice.actions;

export default companySlice.reducer;
