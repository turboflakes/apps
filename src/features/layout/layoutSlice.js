import { createSlice } from '@reduxjs/toolkit';
import { validateChain } from '../chain/chainSlice';

const initializePage = () => {
  const chainName = validateChain()
  let page = document.location.hash.replace(`#/one-t/${chainName}/`, '')
  const indexOfSearchParams = page.indexOf('?');
  if (indexOfSearchParams !== -1) {
    page = page.substring(0, indexOfSearchParams)
  }
  return page
}

const initialState = {
  page: initializePage(),
  mode: 'Live',
  maxHistoryEras: 16
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    pageChanged: (state, action) => {
      state.page = action.payload;
    },
    modeChanged: (state, action) => {
      state.mode = action.payload;
    },
    maxHistoryErasChanged: (state, action) => {
      state.maxHistoryEras = action.payload;
    },
  },
});

export const selectPage = (state) => state.layout.page;
export const selectMode = (state) => state.layout.mode;
export const selectIsLiveMode = (state) => state.layout.mode === 'Live';
export const selectIsHistoryMode = (state) => state.layout.mode === 'History';
export const selectMaxHistoryEras = (state) => state.layout.maxHistoryEras;
export const selectMaxHistorySessions = (state) => state.layout.maxHistoryEras * 6;

export const { 
  pageChanged, 
  modeChanged, 
  maxHistoryErasChanged } = layoutSlice.actions;

export default layoutSlice;
