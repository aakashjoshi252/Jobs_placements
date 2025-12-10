import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../../api/api";

// ============= Thunks =============

// Fetch Resume by Candidate ID
export const fetchResume = createAsyncThunk(
  "resume/fetchResume",
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await userApi.get(`/${candidateId}`, {
        params: { candidateId }
      });
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch resume");
    }
  }
);

// Upload Resume (PDF file)
export const uploadResume = createAsyncThunk(
  "resume/uploadResume",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload resume");
    }
  }
);

// Update Resume (details)
export const updateResume = createAsyncThunk(
  "resume/updateResume",
  async ({ candidateId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/resume/update/${candidateId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update resume");
    }
  }
);

// ============= Slice =============

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resume: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearResume: (state) => {
      state.resume = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.resume = action.payload[0];
        } else {
          state.resume = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.resume = action.payload;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.resume = action.payload;
      });
  }
});

export const { clearResume } = resumeSlice.actions;
export default resumeSlice.reducer;
