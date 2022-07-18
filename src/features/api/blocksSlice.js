import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
  current
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { matchValidatorsReceived } from './validatorsSlice'
import { calculateMvr } from '../../util/mvr'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Blocks'],
  endpoints: (builder) => ({
    getBlock: builder.query({
      query: (blockId) => `/blocks/${blockId}`,
      providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          const msg = JSON.stringify({ method: "subscribe_block", params: [id] });
          dispatch(socketActions.submitMessage(msg))
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.submitMessage(msg))
        }
      },
    }),
  }),
})

export const {
  useGetBlockQuery,
} = extendedApi

// Actions
export const socketBlockReceived = createAction(
  'blocks/blockReceived'
)

// Slice
const blocksAdapter = createEntityAdapter({
  selectId: (data) => data.bix,
})

const matchBlockReceived = isAnyOf(
  socketBlockReceived,
  extendedApi.endpoints.getBlock.matchFulfilled
)

function createValidityData(e, i, m) {
  return { e, i, m };
}

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: blocksAdapter.getInitialState(),
  reducers: {

  },
  extraReducers(builder) {
    builder
    .addMatcher(matchBlockReceived, (state, action) => {
      // Only kept the last 8 blocks in the store
      let currentState = current(state);
      if (currentState.ids.length >= 32) {
        blocksAdapter.removeOne(state, currentState.ids[0])
      }
      blocksAdapter.addOne(state, { ...action.payload, _ts: + new Date()})
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      // get latest block
      const s = current(state)
      const latest_block = s.ids[s.ids.length-1]
      // calculate mvr based on latest validators received data
      const data = action.payload.map(o => { if (o.is_auth && o.is_para) { 
          const stats = Object.values(o.para.stats)
          const explicit_votes = stats.map(o => o.ev).reduce((p, c) => p + c, 0)
          const implicit_votes = stats.map(o => o.iv).reduce((p, c) => p + c, 0)
          const missed_votes = stats.map(o => o.mv).reduce((p, c) => p + c, 0)
          return createValidityData(explicit_votes, implicit_votes, missed_votes)
        } else {
          return createValidityData(0, 0, 0)
        }
      })
      const mvr = calculateMvr(
        data.map(o => o.e).reduce((p, c) => p + c, 0),
        data.map(o => o.i).reduce((p, c) => p + c, 0),
        data.map(o => o.m).reduce((p, c) => p + c, 0),
      )
      blocksAdapter.upsertOne(state, { bix: latest_block, _mvr: mvr})
    })
  }
})

export default blocksSlice;

// Selectors
export const { 
  selectAll,
} = blocksAdapter.getSelectors(state => state.blocks)