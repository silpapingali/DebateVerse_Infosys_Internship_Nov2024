import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchStats = createAsyncThunk(
  "fetchstats",
  async (data, thunk) => {
    const token = localStorage.getItem("token");
    console.log("in fetching");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      return thunk.rejectWithValue(
        err?.response?.data?.message || "Failed to fetch debates"
      );
    }
  }
);

const AdminDebateSlice = createSlice({
  name: "adminDebateSlice",
  initialState: {
    activeUsers: 0,
    blockedUsers: 0,
    openDebates: 0,
    closedDebates: 0,
    isLoading: true,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.activeUsers = action.payload.activeUsers;
        state.blockedUsers = action.payload.blockedUsers;
        state.openDebates = action.payload.openDebates;
        state.closedDebates = action.payload.closedDebates;
        state.isLoading = false;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.errorMessage = action.payload;
        state.isLoading = false;
        console.log(action);
      });
  },
});
export default AdminDebateSlice.reducer;