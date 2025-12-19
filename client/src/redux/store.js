import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import resumeReducer from "./slices/resumeSlice";
import companyReducer from "./slices/companySlice";
import jobReducer from "./slices/job";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    company: companyReducer,
    job:jobReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
});


export default store;
