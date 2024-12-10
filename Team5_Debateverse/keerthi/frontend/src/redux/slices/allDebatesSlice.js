import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all debates with pagination
export const fetchAllDebates = createAsyncThunk(
  "fetchalldebates",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/debates/alldebates/?page=${data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunk.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch debates"
      );
    }
  }
);

// Like request
export const likeDebateRequest = createAsyncThunk(
  "likeDebateRequest",
  async ({ debateId }, thunk) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/debates/likeDebate/?debateId=${debateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { debateId, likes: response.data.likes };
    } catch (err) {
      console.error("Error while liking debate", err);
      return thunk.rejectWithValue("Error while liking debate");
    }
  }
);

const AllDebatesSlice = createSlice({
  name: "allDebatesSlice",
  initialState: {
    debates: {},
    likes: {},
    totalRecords: 0,
    totalPages: 0,
    currPage: 1,
    isLoading: true,
    errorMessage: null,
  },
  reducers: {
    setCurrPage: (state, action) => {
      state.currPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDebates.fulfilled, (state, action) => {
        state.debates[state.currPage] = action.payload.debates;
        state.likes[state.currPage] = action.payload.likes;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / 10);
        state.isLoading = false;
      })
      .addCase(likeDebateRequest.fulfilled, (state, action) => {
        const { debateId, likes } = action.payload;
        if (state.likes[state.currPage]) {
          state.likes[state.currPage][debateId] = likes;
        }
      });
  },
});

export const { setCurrPage } = AllDebatesSlice.actions;
export default AllDebatesSlice.reducer;
