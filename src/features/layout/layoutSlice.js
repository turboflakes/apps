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
  maxHistoryEras: 16,
  identityFilter: '',
  subsetFilter: '',
  // columns hidden by the user in the insights grids: { [field]: false }
  insightsColumnVisibilityModel: {},
  // system chain selected in the collators page, the others are hidden
  collatorsChain: 'ah',
  // collation details hidden by the user, by system chain
  collationHidden: { ah: true, pp: true, bu: true }
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
    identityFilterChanged: (state, action) => {
      state.identityFilter = action.payload;
    },
    subsetFilterChanged: (state, action) => {
      state.subsetFilter = action.payload;
    },
    insightsColumnVisibilityModelChanged: (state, action) => {
      state.insightsColumnVisibilityModel = action.payload;
    },
    collatorsChainChanged: (state, action) => {
      state.collatorsChain = action.payload;
    },
    // hides (true) or shows (false) the collation details of all system chains
    collationHiddenChanged: (state, action) => {
      state.collationHidden = {
        ah: action.payload,
        pp: action.payload,
        bu: action.payload,
      };
    },
  },
});

export const selectPage = (state) => state.layout.page;
export const selectMode = (state) => state.layout.mode;
export const selectIsLiveMode = (state) => state.layout.mode === 'Live';
export const selectIsHistoryMode = (state) => state.layout.mode === 'History';
export const selectMaxHistoryEras = (state) => state.layout.maxHistoryEras;
export const selectMaxHistorySessions = (state) => state.layout.maxHistoryEras * 6;
export const selectIdentityFilter = (state) => state.layout.identityFilter;
export const selectSubsetFilter = (state) => state.layout.subsetFilter;
export const selectCollatorsChain = (state) => state.layout.collatorsChain;
export const selectCollationHidden = (state, chainKey) => state.layout.collationHidden[chainKey];
export const selectInsightsColumnVisibilityModel = (state) =>
  state.layout.insightsColumnVisibilityModel;

export const {
  pageChanged,
  modeChanged,
  maxHistoryErasChanged,
  identityFilterChanged,
  subsetFilterChanged,
  insightsColumnVisibilityModelChanged,
  collatorsChainChanged,
  collationHiddenChanged
 } = layoutSlice.actions;

export default layoutSlice;
