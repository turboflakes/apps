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
      async onQueryStarted(params, { getState, dispatch, queryFulfilled }) {
        try {
          // const { data } = await queryFulfilled
          await queryFulfilled
          // `onSuccess` subscribe for updates
          if (params.blockId === "finalized") {
            // subscribe to finalized block and from previous session at the same index
            let msg = JSON.stringify({ method: "subscribe_block", params: ["finalized", "1"] });
            dispatch(socketActions.messageQueued(msg))
          }
          else if (params.blockId === "best") {
            const msg = JSON.stringify({ method: "subscribe_block", params: ["best"] });
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

const _calculateBlockMvr = (current, previous) => {
  if (isUndefined(current) || isUndefined(current.stats)) { 
    return -1
  }
  if (isUndefined(previous) || isUndefined(previous.stats) || current.block_number - 1 !== previous.block_number) {
    const mvr = calculateMvr(current.stats.ev, current.stats.iv, current.stats.mv);
    if (isUndefined(mvr)) {
      return -1
    }
    return mvr
  }
  return calculateMvr(
    current.stats.ev - previous.stats.ev, 
    current.stats.iv - previous.stats.iv, 
    current.stats.mv - previous.stats.mv);
}

const calculateBlockMvr = (i, data, current, previous) => {
  const mvr = _calculateBlockMvr(current, previous)
  if (mvr === -1) {
    return undefined
  }
  if (isUndefined(mvr)) {
    return calculateBlockMvr(i - 1, data, current, data[i - 1])
  }
  return mvr
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
      if (block.is_finalized) {
        blocksAdapter.upsertOne(state, { 
          ...action.payload, 
          _mvr: !isUndefined(block.stats) ? calculateBlockMvr(0, [], block, currentState.entities[block.block_number - 1]) : undefined,
          _ts: + new Date()
        })
      } else {
        blocksAdapter.upsertOne(state, { 
          ...action.payload, 
          _ts: + new Date()
        })
      }
    })
    .addMatcher(matchBlocksReceived, (state, action) => {
      let currentState = current(state);

      const blocks = action.payload.data.map((block, i) => {
        if (block.is_finalized && !isUndefined(block.stats)) {
          const previousBlock = i > 0 ? (isUndefined(currentState.entities[block.block_number - 1]) ? action.payload.data[i - 1] : currentState.entities[block.block_number - 1]) : currentState.entities[block.block_number - 1]
          return  {
            ...block,
            _mvr: calculateBlockMvr(i, action.payload.data, block, previousBlock),
            _ts: + new Date()
          }  
        }
        return  {
          ...block,
          _ts: + new Date()
        }
      })
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
    return selectAll(state).filter(b => b.is_finalized && b.block_number >= session.sbix)
  }
  return []
};

export const selectLastXBlocks = (state, x = 600) => {
  // const finalizedBlocks = selectAll(state).filter(b => b.is_finalized && !isUndefined(b.stats) ? b.stats.ev + b.stats.iv + b.stats.mv !== 0 : false)
  // 
  const finalizedBlocks = selectAll(state)
  return finalizedBlocks.slice(Math.max(finalizedBlocks.length - x, 1))
};