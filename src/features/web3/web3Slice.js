import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  account: undefined
};

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    accountChanged: (state, action) => {
      state.account = action.payload;
    },
  },
});

export const selectAccount = (state) => state.web3.account;

export const { accountChanged } = web3Slice.actions;

export default web3Slice;
