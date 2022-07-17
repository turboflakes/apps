import { createSlice } from '@reduxjs/toolkit';
import { validateChain } from '../chain/chainSlice';

const initializePage = () => {
  const chainName = validateChain()
  let page = document.location.hash.replace(`#/${chainName}/`, '')
  const indexOfSearchParams = page.indexOf('?');
  if (indexOfSearchParams !== -1) {
    page = page.substring(0, indexOfSearchParams)
  }
  return page
}

const initialState = {
  page: initializePage()
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    pageChanged: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const selectPage = (state) => state.layout.page;

export const { pageChanged } = layoutSlice.actions;

export default layoutSlice;
