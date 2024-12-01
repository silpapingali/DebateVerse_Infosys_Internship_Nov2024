import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllDebates = createAsyncThunk(
  "fetchalldebates",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    console.log("in fetching");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/debates/alldebates/?page=${data}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      return thunk.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch debates"
      );
    }
  }
);

const AllDebateSlice = createSlice({
  name: "alldebateSlice",
  initialState: {
    debates: {},
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
      .addCase(fetchAllDebates.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllDebates.fulfilled, (state, action) => {
        if (Object.keys(state.debates).length > 10) {
          delete state.debates[Object.keys(state.debates)[0]];
        }
        state.debates = {
          ...state.debates,
          [state.currPage]: action.payload.debates,
        };
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = Math.ceil(state.totalRecords / 10);
        state.isLoading = false;
        console.log(state.debates);
      })
      .addCase(fetchAllDebates.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
        console.log(action);
      });
  },
});
export const { setCurrPage } = AllDebateSlice.actions;
export default AllDebateSlice.reducer;
