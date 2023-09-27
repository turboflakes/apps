import { createSlice } from '@reduxjs/toolkit';
import isNull from 'lodash/isNull'

const SUPPORTED_APPS = ['onet', 'nomi'];

export const validateApp = () => {
  //example: "?app=nomi" || "?app=onet"
  const app = new URL(document.location.href).searchParams.get('app')
  if (!isNull(app) && SUPPORTED_APPS.includes(app)) {
    return app
  }
  // TODO: store/read from localStorage if chain is not provided
  return 'onet'
}

const initialState = {
  name: validateApp(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appChanged: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const selectApp = (state) => state.app.name;

export const { appChanged } = appSlice.actions;

export default appSlice;
