import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
  current
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'

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
  selectId: (data) => data.block_number,
})

const matchBlockReceived = isAnyOf(
  socketBlockReceived,
  extendedApi.endpoints.getBlock.matchFulfilled
)

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: blocksAdapter.getInitialState(),
  reducers: {

  },
  extraReducers(builder) {
    builder.addMatcher(matchBlockReceived, (state, action) => {
      // Only kept the last 8 blocks in the store
      let currentState = current(state);
      if (currentState.ids.length >= 8) {
        blocksAdapter.removeOne(state, currentState.ids[0])
      }
      blocksAdapter.addOne(state, { ...action.payload, _ts: + new Date()})
    })
  }
})

export default blocksSlice;

// Selectors
export const { 
  selectAll,
} = blocksAdapter.getSelectors(state => state.blocks)