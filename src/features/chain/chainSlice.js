import { createSlice } from '@reduxjs/toolkit';
import isNull from 'lodash/isNull'

const SUPPORTED_CHAINS = ['kusama', 'polkadot', 'paseo'];

export const validateChain = () => {
  //example: "?chain=polkadot" || "?chain=kusama"
  const chain = new URL(document.location.href).searchParams.get('chain')
  if (!isNull(chain) && SUPPORTED_CHAINS.includes(chain)) {
    return chain
  }
  // TODO: store/read from localStorage if chain is not provided
  return 'polkadot'
}

const initialState = {
  name: validateChain(),
};

const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    chainChanged: (state, action) => {
      state.name = action.payload;
    },
    chainInfoChanged: (state, action) => {
      state.info = action.payload;
    },
    addressChanged: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const selectChain = (state) => state.chain.name;
export const selectChainInfo = (state) => state.chain.info;
export const selectAddress = (state) => state.chain.address;

export const { chainChanged, chainInfoChanged, addressChanged } = chainSlice.actions;

export default chainSlice;
