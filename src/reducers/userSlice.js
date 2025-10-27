import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {

    token :{
      key : false
    }
    
   
  
  },
  reducers: {
    
    setToken : (state , action) => {
      state.token = action.payload
    }
  },
});

export const {
  setToken
} = userSlice.actions;

export default userSlice.reducer;
