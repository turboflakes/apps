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
  tagTypes: ['Sessions'],
  endpoints: (builder) => ({
    getSessionByIndex: builder.query({
      query: (index) => `/sessions/${index}`,
      providesTags: (result, error, arg) => [{ type: 'Sessions', id: arg }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          const msg = JSON.stringify({ method: "subscribe_session", params: [id] });
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
  useGetSessionByIndexQuery,
} = extendedApi

// Actions
export const socketSessionReceived = createAction(
  'sessions/sessionReceived'
)

// Slice
const sessionsAdapter = createEntityAdapter({
  selectId: (data) => data.six,
})

const matchSessionReceived = isAnyOf(
  socketSessionReceived,
  extendedApi.endpoints.getSessionByIndex.matchFulfilled
)

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: sessionsAdapter.getInitialState(),
  reducers: {

  },
  extraReducers(builder) {
    builder.addMatcher(matchSessionReceived, (state, action) => {
      // Only kept the last 6 sessions in the store
      let currentState = current(state);
      if (currentState.ids.length >= 8) {
        sessionsAdapter.removeOne(state, currentState.ids[0])
      }
      sessionsAdapter.addOne(state, { ...action.payload, _ts: + new Date()})
    })
  }
})

export default sessionsSlice;

// Selectors
export const { 
  selectAll: selectSessionsAll,
  selectById: selectSessionByIndex
} = sessionsAdapter.getSelectors(state => state.sessions)