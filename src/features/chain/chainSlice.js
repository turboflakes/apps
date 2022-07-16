import { createSlice } from '@reduxjs/toolkit';

const chains = ['westend', 'kusama', 'polkadot'];

const validateChain = () => {
  //example: hash= "#/polkadot"
  const chain = document.location.hash.substring(2, document.location.hash.length)
  if (document.location.pathname === '/' && chains.includes(chain)) {
    return chain
  }
  return 'kusama'
}

const initialState = {
  name: validateChain()
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
