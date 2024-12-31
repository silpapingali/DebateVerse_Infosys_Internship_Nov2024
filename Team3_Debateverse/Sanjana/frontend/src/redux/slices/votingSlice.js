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
  },
  extraReducers: (builder) => { 
    builder
      .addCase(fetchVotes.fulfilled, (state, action) => {
        state.votes = action.payload;
      })
      .addCase(fetchVotes.rejected, (state, action) => {
        state.votes = [];
      });
  },
});

export const { setQno, setDebate, setLike } = votingSlice.actions;
export default votingSlice.reducer;