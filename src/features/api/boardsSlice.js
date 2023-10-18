import {
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import apiSlice from './apiSlice'

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
  initialState: adapter.getInitialState(),
  reducers: {},
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
    })
  }
})

export default boardsSlice;

// Selectors
export const { 
  selectAll,
  selectById: selectBoardById,
} = adapter.getSelectors(state => state.boards)

export const selectBoardBySessionAndHash = (state, session, hash) => selectBoardById(state, `${session}_${hash}`)
export const selectBoardAddressesBySessionAndHash = (state, session, hash) => {
  const board = selectBoardBySessionAndHash(state, session, hash)
  if (!isUndefined(board)) {
    return board.addresses
  }
  return []
}
