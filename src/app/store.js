import { configureStore } from '@reduxjs/toolkit';
import appSlice from '../features/app/appSlice';
import apiSlice from '../features/api/apiSlice'
import chainSlice from '../features/chain/chainSlice';
import web3Slice from '../features/web3/web3Slice';
import layoutSlice from '../features/layout/layoutSlice';
import socketMiddleware from '../features/api/socketMiddleware';
import socketSlice from '../features/api/socketSlice';
import blocksSlice from '../features/api/blocksSlice';
import sessionsSlice from '../features/api/sessionsSlice';
import validatorsSlice from '../features/api/validatorsSlice';
import authoritiesSlice from '../features/api/authoritiesSlice';
import valGroupsSlice from '../features/api/valGroupsSlice';
import parachainsSlice from '../features/api/parachainsSlice';
import valProfilesSlice from '../features/api/valProfilesSlice';
import poolsSlice from '../features/api/poolsSlice';
import poolsMetadataSlice from '../features/api/poolsMetadataSlice';
import boardsSlice from '../features/api/boardsSlice';
import boardsLimitsSlice from '../features/api/boardsLimitsSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    chain: chainSlice.reducer,
    web3: web3Slice.reducer,
    layout: layoutSlice.reducer,
    authorities: authoritiesSlice.reducer,
    blocks: blocksSlice.reducer,
    sessions: sessionsSlice.reducer,
    validators: validatorsSlice.reducer,
    val_profiles: valProfilesSlice.reducer,
    val_groups: valGroupsSlice.reducer,
    parachains: parachainsSlice.reducer,
    pools: poolsSlice.reducer,
    pools_metadata: poolsMetadataSlice.reducer,
    boards: boardsSlice.reducer,
    boards_limits: boardsLimitsSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    socket: socketSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['socket/messagesDispatched'],
      },
    }).concat([apiSlice.middleware, socketMiddleware]),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({immutableCheck: false, serializableCheck: false,}).concat([apiSlice.middleware, socketMiddleware]),
});
