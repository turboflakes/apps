import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Sessions'],
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: ({max}) => ({
        url: `/sessions`,
        params: { max }
      }),
      providesTags: (result, error, arg) => [{ type: 'Sessions', id: arg }],
      transformResponse: responseData => {
        return responseData.data
      },
    }),
    getSessionByIndex: builder.query({
      query: (index) => `/sessions/${index}`,
      providesTags: (result, error, arg) => [{ type: 'Sessions', id: arg }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          if (id === "current") {
            const msg = JSON.stringify({ method: "subscribe_session", params: ["new"] });
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
  useGetSessionsQuery,
  useGetSessionByIndexQuery,
} = extendedApi

// Actions
export const socketSessionReceived = createAction(
  'sessions/sessionReceived'
)

export const socketSessionsReceived = createAction(
  'sessions/sessionsReceived'
)

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.six,
})

const matchSessionReceived = isAnyOf(
  socketSessionReceived,
  extendedApi.endpoints.getSessionByIndex.matchFulfilled
)

export const matchSessionsReceived = isAnyOf(
  socketSessionsReceived,
  extendedApi.endpoints.getSessions.matchFulfilled
)

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: {
    current: "current",
    ...adapter.getInitialState()
  },
  reducers: {
    sessionHistoryChanged: (state, action) => {
      state.history = action.payload;
    },
    sessionChanged: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers(builder) {
    builder
    .addMatcher(matchSessionReceived, (state, action) => {
      // update session current from sessionReceived (needed when new session is received)
      if (action.payload.is_current) {
        state.current = action.payload.six
      }
      // update session with timestamp
      adapter.upsertOne(state, { ...action.payload, _ts: + new Date()})
    })
    .addMatcher(matchSessionsReceived, (state, action) => {
      const sessions = action.payload.map(session => ({
        ...session,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, sessions)
    })
  }
})

// Selectors
export const { 
  selectAll: selectSessionsAll,
  selectById: selectSessionByIndex
} = adapter.getSelectors(state => state.sessions)

export const selectSessionHistory = (state) => state.sessions.history;
export const selectSessionCurrent = (state) => state.sessions.current;

export const { sessionHistoryChanged } = sessionsSlice.actions;

export default sessionsSlice;