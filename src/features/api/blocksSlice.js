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
          const { data } = await queryFulfilled
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

const _calculateBlockMvr = (previousBlock, currentBlock) => {
  if (isUndefined(currentBlock)) {
    return -4
  }
  if (isUndefined(currentBlock.stats)) {
    return -1;
  }
  if (isUndefined(previousBlock)) {
    return calculateMvr(currentBlock.stats.ev, currentBlock.stats.iv, currentBlock.stats.mv)
  } else {
    if (isUndefined(previousBlock.stats)) {
      return -1;
    }
    const votes = currentBlock.stats.ev - previousBlock.stats.ev + currentBlock.stats.iv - previousBlock.stats.iv + currentBlock.stats.mv - previousBlock.stats.mv;
    if (votes === 0) {
      return -1;
    }
    return calculateMvr(
      currentBlock.stats.ev - previousBlock.stats.ev, 
      currentBlock.stats.iv - previousBlock.stats.iv, 
      currentBlock.stats.mv - previousBlock.stats.mv);
  }
}

const calculateBlockMvr = (state, block) => {
  if (isUndefined(block)) {
    return undefined
  }
  if (isUndefined(block.block_number)) {
    return undefined
  }
  const mvr = _calculateBlockMvr(state.entities[block.block_number - 1], block);
  console.log("___", block.block_number, mvr, block);
  if (mvr === -1){
    return calculateBlockMvr(state, state.entities[block.block_number - 1]);
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
      blocksAdapter.upsertOne(state, { 
        ...action.payload, 
        _mvr: !isUndefined(block.stats) ? calculateBlockMvr(currentState, block) : undefined,
        _ts: + new Date()
      })
    })
    .addMatcher(matchBlocksReceived, (state, action) => {
      let currentState = current(state);
      const blocks = action.payload.data.map(block => ({
        ...block,
        _mvr: !isUndefined(block.stats) ? calculateBlockMvr(currentState, block) : undefined,
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