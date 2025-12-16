import { createSlice } from "@reduxjs/toolkit";

// Load user from sessionStorage
const storedUser = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    isAuthenticated: !!storedUser,
    loading: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      //  Save to sessionStorage
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },

    authLoaded: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;

      //  Clear sessionStorage
      sessionStorage.removeItem("user");
    },

    authFailed: (state) => {
      state.loading = false;
    },
  },
});

export const { loginSuccess, logout, authLoaded, authFailed, } = authSlice.actions;
export default authSlice.reducer;
