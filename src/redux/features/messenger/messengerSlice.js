import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  package: {}
};

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setPackage: (state, action) => {
      state.package = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetState: (state) => {
      return initialState;
    }
  },
  
});

export const { setPackage } = messengerSlice.actions;
export const selectPackage = state => state.messenger.package;
export default messengerSlice;