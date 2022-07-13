import { createSlice } from '@reduxjs/toolkit';
 
const initialState = {
  isConnected: false
};
 
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectionEstablished: (state => {
      state.isConnected = true;
    }),
    // receiveAllMessages: ((state, action: PayloadAction<{
    //   messages: ChatMessage[]
    // }>) => {
    //   state.messages = action.payload.messages;
    // }),
    // receiveMessage: ((state, action: PayloadAction<{
    //   message: ChatMessage
    // }>) => {
    //   state.messages.push(action.payload.message);
    // }),
    submitMessage: ((state, action) => {
      return;
    })
  },
});
 
export const socketActions = socketSlice.actions;
 
export default socketSlice;