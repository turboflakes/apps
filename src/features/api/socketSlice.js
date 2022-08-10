import { 
  createSlice,
  current } from '@reduxjs/toolkit';
 
const initialState = {
  isConnected: false,
  messages: [],
};
 
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectionEstablished: (state => {
      state.isConnected = true;
    }),
    connectionClosed: (state => {
      state.isConnected = false;
    }),
    messageQueued: ((state, action) => {
      state.messages.push(action)
    }),
    messagesDispatched: ((state, action) => {
      const socket = action.payload;
      if (socket.readyState === WebSocket.OPEN) {
        const _state = current(state)
        _state.messages.forEach((m) => socket.send(m.payload));
        state.messages = []
      }
    })
  },
});
 
export const socketActions = socketSlice.actions;
 
export default socketSlice;

// Selectors
export const selectIsSocketConnected = (state) => state.socket.isConnected;
export const selectMessagesInQueue = (state) => state.socket.messages.length > 0;
