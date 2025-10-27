import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",

  initialState: {
    isVisible: false,
    message: "",
  },

  reducers: {
    showLoading: (state, action) => {
      state.isVisible = action.payload.isVisible;
      state.message = action.payload.message;
    },

    hideLoading: (state) => {
      state.isVisible = false;
      state.message = "";
    },

    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { showLoading, hideLoading, setMessage } = loaderSlice.actions;

export default loaderSlice.reducer;
