import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: []
};

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
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

export const { setMessages } = messengerSlice.actions;
export const selectMessages = state => state.messenger.messages;
export default messengerSlice;