import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'

import { 
  matchPoolsReceived,
} from './poolsSlice'

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.id,
  sortComparer: (a, b) => a.id > b.id,
})

const poolsMetadataSlice = createSlice({
  name: 'pools_metadata',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchPoolsReceived, (state, action) => {
      const pools = action.payload.data.map(pool => ({
        ...pool,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, pools)
    })
  }
})

// Selectors
export const { 
  selectAll: selectPoolsAll,
  selectById: selectPoolById
} = adapter.getSelectors(state => state.pools_metadata)

export const selectTotalOpen = (state) => selectPoolsAll(state).filter(p => p.state === "Open").length

export default poolsMetadataSlice;