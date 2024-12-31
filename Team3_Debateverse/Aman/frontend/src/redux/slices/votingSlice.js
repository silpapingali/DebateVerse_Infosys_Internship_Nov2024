import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVotes = createAsyncThunk(
  "fetchVotes",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/debates/fetchvotes/?debateId=${data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return thunk.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch votes"
      );
    }
  }
);

const votingSlice = createSlice({
  name: "voting",
  initialState: {
    debate: {},
    liked: false,
    Qno: 0,
    votes: [],
    isVoted: false,
    isLoading: true,
  },
  reducers: {
    setQno: (state, action) => {
        console.log("in setQno");
        state.Qno = action.payload;
    },
    setDebate: (state, action) => {
      state.debate = action.payload;
    },
    setLike: (state, action) => {
      state.liked = action.payload;
    },
    setVotes: (state, action) => {
      const { index, val } = action.payload;
      state.votes[index] = state.votes[index] + Number(val);
    }
  },
  extraReducers: (builder) => { 
    builder
      .addCase(fetchVotes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload.votes.length === 0){
          state.isVoted= false;
          state.votes = new Array(state.debate.options.length).fill(0);
          return;
        }
        state.votes = action.payload.votes;
        state.isVoted = true;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.isLoading = false;
        state.votes = [];
      });
  },
});

export const { setQno, setDebate, setLike, setVotes } = votingSlice.actions;
export default votingSlice.reducer;
