import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
  current
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import findLast from 'lodash/findLast'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { selectSessionByIndex } from './sessionsSlice'
import { calculateMvr } from '../../util/mvr'


export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Blocks'],
  endpoints: (builder) => ({
    getBlocks: builder.query({
      query: ({session, show_stats}) => ({
        url: `/blocks`,
        params: { session, show_stats }
      }),
      providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg }],
    }),
    getBlock: builder.query({
      query: ({blockId, show_stats}) => ({
        url: `/blocks/${blockId}`,
        params: { show_stats }
      }),
      providesTags: (result, error, arg) => [{ type: 'Blocks', id: arg }],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          if (params.blockId === "finalized" || params.blockId === "best") {
            const msg = JSON.stringify({ method: "subscribe_block", params: [params.blockId.toString()] });
            dispatch(socketActions.messageQueued(msg))
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
  }),
})

export const {
  useGetBlockQuery,
  useGetBlocksQuery,
} = extendedApi

// Actions
export const socketBlockReceived = createAction(
  'blocks/blockReceived'
)

export const socketBlocksReceived = createAction(
  'blocks/blocksReceived'
)

// Slice
const blocksAdapter = createEntityAdapter({
  selectId: (data) => data.block_number,
  sortComparer: (a, b) => a.block_number > b.block_number,
})

const matchBlockReceived = isAnyOf(
  socketBlockReceived,
  extendedApi.endpoints.getBlock.matchFulfilled
)

export const matchBlocksReceived = isAnyOf(
  socketBlocksReceived,
  extendedApi.endpoints.getBlocks.matchFulfilled
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
      // Only kept the last 1000 blocks in the store
      let currentState = current(state);
      if (currentState.ids.length >= 1000) {
        blocksAdapter.removeOne(state, currentState.ids[0])
      }
      const block = action.payload;
      blocksAdapter.addOne(state, { 
        ...action.payload, 
        _mvr: !isUndefined(block.stats) ? calculateMvr(block.stats.ev, block.stats.iv, block.stats.mv) : undefined,
        _ts: + new Date()
      })
    })
    .addMatcher(matchBlocksReceived, (state, action) => {
      const blocks = action.payload.data.map(block => ({
        ...block,
        _mvr: !isUndefined(block.stats) ? calculateMvr(block.stats.ev, block.stats.iv, block.stats.mv) : undefined,
        _ts: + new Date()
      }))
      blocksAdapter.upsertMany(state, blocks)
    })
  }
})

export default blocksSlice;

// Selectors
export const { 
  selectAll,
  selectById: selectBlockById,
} = blocksAdapter.getSelectors(state => state.blocks)

export const selectBlock = (state) => !!state.blocks.ids.length ? state.blocks.entities[state.blocks.ids[state.blocks.ids.length-1]] : undefined;
export const selectBestBlock = (state) => {
  if (!!state.blocks.ids.length) {
    const block = findLast(selectAll(state), block => isUndefined(block.is_finalized))
    if (!isUndefined(block)) {
      return block
    }
  }
};
export const selectFinalizedBlock = (state) => {
  if (!!state.blocks.ids.length) {
    const block = findLast(selectAll(state), block => !isUndefined(block.is_finalized) && block.is_finalized)
    if (!isUndefined(block)) {
      return block
    }
  }
};

export const selectPreviousFinalizedBlock = (state) => {
  const finalized = selectFinalizedBlock(state)
  if (!isUndefined(finalized)) {
    return selectBlockById(state, finalized.block_number - 1)
  }
};

export const selectBlocksBySession = (state, sessionIndex) => {
  const session = selectSessionByIndex(state, sessionIndex)
  if (!isUndefined(session)) {
    return selectAll(state).filter(b => b.block_number >= session.sbix)
  }
  return []
};