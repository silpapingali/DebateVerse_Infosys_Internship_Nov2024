import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllDebates = createAsyncThunk(
  "fetchalldebates",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    console.log("in fetching");
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

export const likeRequest = createAsyncThunk(
  "likeRequest",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8000/api/debates/likerequest/?debateId=${data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {}
  }
);

const AllDebateSlice = createSlice({
  name: "alldebateSlice",
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
    setLiked: (state, action) => {
      console.log(action.payload);
      state.likes[state.currPage][action.payload.index] =
        !state.likes[state.currPage][action.payload.index];

      state.debates[state.currPage][action.payload.index].totalLikes +=
        action.payload.val;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDebates.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllDebates.fulfilled, (state, action) => {
        if (Object.keys(state.debates).length > 10) {
          delete state.debates[Object.keys(state.debates)[0]];
          delete state.debates[Object.keys(state.likes)[0]];
        }
        state.debates = {
          ...state.debates,
          [state.currPage]: action.payload.debates,
        };
        state.likes = {
          ...state.likes,
          [state.currPage]: action.payload.likes,
        };
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / 10);
        state.isLoading = false;
      })
      .addCase(fetchAllDebates.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
        console.log(action);
      });
  },
});
export const { setCurrPage, setLiked } = AllDebateSlice.actions;
export default AllDebateSlice.reducer;