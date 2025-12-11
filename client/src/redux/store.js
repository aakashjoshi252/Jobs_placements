import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import resumeReducer from "./slices/resumeSlice";
import companyReducer from "./slices/companySlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    company: companyReducer,
    },
});

export default store;
