import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all debates with pagination
export const fetchAllDebates = createAsyncThunk(
  "fetchAllDebates",
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
    userVotes: {}, // User votes per debate tracking
  },
  reducers: {
    setCurrPage: (state, action) => {
      state.currPage = action.payload;
    },
    resetUserVotes: (state) => {
      state.userVotes = {};
    },
    voteOption: (state, action) => {
      const { debateId, optionId } = action.payload;
      const MAX_VOTES = 10; 

      if (!state.userVotes[debateId]) {
        state.userVotes[debateId] = 0; // Initialize if no votes yet
      }

      // Check if the user has votes left
      if (state.userVotes[debateId] < MAX_VOTES) {
        const debate = state.debates[state.currPage]?.find(
          (d) => d._id === debateId
        );

        if (debate) {
          const option = debate.options.find((opt) => opt._id === optionId);

          if (option) {
            option.votes += 1;
            state.userVotes[debateId] += 1;
          }
        }
      } else {
        console.log("User has already cast 10 votes for this debate.");
      }
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

export const { setCurrPage, resetUserVotes, voteOption } = AllDebatesSlice.actions;
export default AllDebatesSlice.reducer;
