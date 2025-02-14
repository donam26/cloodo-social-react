import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  unreadMessages: {},  // { conversationId: count }
  isLoading: false,
  error: null
};

export const messengerSlice = createSlice({
  name: 'messenger',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addUnreadMessage: (state, action) => {
      const { conversationId } = action.payload;
      state.unreadMessages[conversationId] = (state.unreadMessages[conversationId] || 0) + 1;
    },
    clearUnreadMessages: (state, action) => {
      const { conversationId } = action.payload;
      state.unreadMessages[conversationId] = 0;
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

export const { 
  setMessages, 
  addUnreadMessage, 
  clearUnreadMessages,
  setLoading, 
  setError, 
  resetState 
} = messengerSlice.actions;

export const selectMessages = state => state.messenger.messages;
export default messengerSlice.reducer;