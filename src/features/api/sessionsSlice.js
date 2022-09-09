import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import toNumber from 'lodash/toNumber'
import isArray from 'lodash/isArray'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { 
  matchValidatorsReceived,
} from './validatorsSlice'
import { 
  selectValidatorsBySessionAndGroupId,
  selectValidatorIdsBySessionAndGroupId
} from './valGroupsSlice'
import { calculateMvr } from '../../util/mvr'

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
    .addMatcher(matchValidatorsReceived, (state, action) => {
      // Filter validators if authority and p/v
      const filtered = action.payload.filter(v => v.is_auth && v.is_para);
      // Note: we assume that every payload is under a unique session
      const session = filtered[0].session;
      const groupIds = uniq(filtered.map(v => toNumber(v.para.group))).sort((a, b) => a - b)
      const mvrs = filtered.map(v => calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv));
      adapter.upsertOne(state, { six: session, groupIds, mvrs})
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
export const selectValGroupIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session).groupIds) ? selectSessionByIndex(state, session).groupIds : []) : [];
export const selectMVRsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session).mvrs) ? selectSessionByIndex(state, session).mvrs : []) : [];
export const selectParaValidatorIdsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? selectSessionByIndex(state, session).groupIds.map(groupId => selectValidatorIdsBySessionAndGroupId(state, session, groupId)) : []
export const selectParaValidatorsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? selectSessionByIndex(state, session).groupIds.map(groupId => selectValidatorsBySessionAndGroupId(state, session, groupId)) : []

export const { sessionHistoryChanged } = sessionsSlice.actions;

export default sessionsSlice;