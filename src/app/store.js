import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../features/api/apiSlice'
import chainSlice from '../features/chain/chainSlice';
import web3Slice from '../features/web3/web3Slice';
import layoutSlice from '../features/layout/layoutSlice';
import socketMiddleware from '../features/api/socketMiddleware';
import socketSlice from '../features/api/socketSlice';
import blocksSlice from '../features/api/blocksSlice';
import sessionsSlice from '../features/api/sessionsSlice';
import validatorsSlice from '../features/api/validatorsSlice';

export const store = configureStore({
  reducer: {
    chain: chainSlice.reducer,
    web3: web3Slice.reducer,
    layout: layoutSlice.reducer,
    blocks: blocksSlice.reducer,
    sessions: sessionsSlice.reducer,
    validators: validatorsSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    socket: socketSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiSlice.middleware, socketMiddleware]),
});
