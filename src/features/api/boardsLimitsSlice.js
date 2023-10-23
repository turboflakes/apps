import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import findLast from 'lodash/findLast'
import apiSlice from './apiSlice'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['BoardsLimits'],
  endpoints: (builder) => ({
    getBoardsLimits: builder.query({
      query: ({session}) => ({
        url: `/boards/limits`,
        params: { session }
      }),
      providesTags: (result, error, arg) => [{ type: 'BoardsLimits', id: arg }],
    }),
  }),
})

export const {
  useGetBoardsLimitsQuery,
} = extendedApi

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.session,
  sortComparer: (a, b) => a.session > b.session,
})

const boardsLimitsSlice = createSlice({
  name: 'boards_limits',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(extendedApi.endpoints.getBoardsLimits.matchFulfilled, (state, action) => {
      adapter.upsertOne(state, { ...action.payload, _ts: + new Date()})
    })
  }
})

export default boardsLimitsSlice;

// Selectors
export const { 
  selectAll,
  selectById: selectBoardLimitsById,
} = adapter.getSelectors(state => state.boards_limits)

export const selectBoardsLimitsBySession = (state, session) => selectBoardLimitsById(state, `${session}`);