import { createSlice } from "@reduxjs/toolkit";

const pkgSlice = createSlice({
  name: "pkg",
  initialState: {},
  reducers: {
    pkgReceived: (state, actions) => {
      state.api = { ...actions.payload };
    },
  },
});

export const pkgActions = pkgSlice.actions;

// Selectors
export const selectVersion = (state) => state.api.pkg_version;
export const isVersionV0 = (state) =>
  checkMajorVersion(state.api.pkg_version, 0);
export const isVersionV1 = (state) =>
  checkMajorVersion(state.pkg.api?.pkg_version, 1);

function checkMajorVersion(version, major) {
  const regex = new RegExp(`^${major}\\.`);
  return regex.test(version);
}

export default pkgSlice;
