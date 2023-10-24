import {
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import isUndefined from 'lodash/isUndefined'
import apiSlice from './apiSlice'
import {
  selectValProfileByAddress
} from '../api/valProfilesSlice';

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Boards'],
  endpoints: (builder) => ({
    getBoards: builder.query({
      query: ({session, w, i, f, n, force}) => ({
        url: `/boards`,
        params: { session, w, i, f, n, force }
      }),
      providesTags: (result, error, arg) => [{ type: 'Boards', id: arg }],
    }),
  }),
})

export const {
  useGetBoardsQuery,
} = extendedApi

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.hash}`,
})

export const matchBoardsReceived = isAnyOf(
  extendedApi.endpoints.getBoards.matchFulfilled
)

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    candidates: [],
    ...adapter.getInitialState()
  },
  reducers: {
    candidatesAdded: (state, action) => {
      state.candidates = union(state.candidates, [...action.payload]).slice(0, 16);
    },
    candidatesCleared: (state) => {
      state.candidates = [];
    },
    candidateAdded: (state, action) => {
      state.candidates = union(state.candidates, [action.payload]);
    },
    candidateRemoved: (state, action) => {
      state.candidates = state.candidates.filter(c => c !== action.payload);
    },
  },
  extraReducers(builder) {
    builder
    .addMatcher(matchBoardsReceived, (state, action) => {
      const boards = action.payload.data.map((board, i) => {
        return  {
          ...board,
          _ts: + new Date()
        }
      })
      adapter.upsertMany(state, boards)
      state.synced_session = action.payload.data.length > 0 ? action.payload.data[0].session : 0;
      state.synced_at_block = action.payload.data.length > 0 ? action.payload.data[0].block_number : 0;
    })
  }
})

export default boardsSlice;
export const { candidateAdded, candidatesAdded, candidatesCleared, candidateRemoved } = boardsSlice.actions;

// Selectors
export const { 
  selectAll,
  selectById: selectBoardById,
} = adapter.getSelectors(state => state.boards)

export const selectBoardBySessionAndHash = (state, session, hash) => selectBoardById(state, `${session}_${hash}`)
export const selectBoardAddressesBySessionAndHash = (state, session, hash) => {
  if (isUndefined(session) || isUndefined(hash)) {
    return []
  }
  const board = selectBoardBySessionAndHash(state, session, hash)
  if (!isUndefined(board)) {
    return board.addresses
  }
  return []
}

export const selectBoardProfilesBySessionAndHash = (state, session, hash) => {
  const addresses = selectBoardAddressesBySessionAndHash(state, session, hash);
  return addresses.map(a => {
    const p = selectValProfileByAddress(state, a);
    return {
      stash: a,
      colorStart: p.colorStart,
      colorEnd: p.colorEnd
    }
  })
}

export const selectSyncedSession = (state) => state.boards.synced_session;
export const selectSyncedAtBlock = (state) => state.boards.synced_at_block;
export const selectCandidates = (state) => state.boards.candidates;
export const selectIsCandidate = (state, stash) => state.boards.candidates.includes(stash);