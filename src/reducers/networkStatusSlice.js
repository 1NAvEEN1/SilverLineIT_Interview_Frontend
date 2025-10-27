// networkSlice.js
import { createSlice } from "@reduxjs/toolkit";

const networkSlice = createSlice({
  name: "network",
  initialState: {
    status: "idle",
  },
  reducers: {
    changeState: (state, action) => {
      state.status = action.payload.status;
    },
  },
});

export const { changeState } = networkSlice.actions;

export const selectNetworkStatus = (state) => state.network.status;

export default networkSlice.reducer;
