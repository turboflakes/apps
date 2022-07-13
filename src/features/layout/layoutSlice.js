import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  page: 'val-groups'
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
