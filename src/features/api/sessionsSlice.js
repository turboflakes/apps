import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import isUndefined from 'lodash/isUndefined'
import toNumber from 'lodash/toNumber'
import isArray from 'lodash/isArray'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { 
  matchValidatorsReceived,
} from './validatorsSlice'
import { 
  matchParachainsReceived,
} from './parachainsSlice'
import { 
  selectValidatorsBySessionAndGroupId,
  selectValidatorIdsBySessionAndGroupId
} from './valGroupsSlice'
import { calculateMvr } from '../../util/mvr'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Sessions'],
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: ({number_last_sessions, show_stats}) => ({
        url: `/sessions`,
        params: { number_last_sessions, show_stats }
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
        _mvr: !isUndefined(session.stats) ? calculateMvr(session.stats.ev, session.stats.iv, session.stats.mv) : undefined,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, sessions)
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      // Filter validators if authority and p/v
      const filtered = action.payload.data.filter(v => v.is_auth && v.is_para);

      // Group validators by session first
      const groupedBySession = groupBy(filtered, v => !!v.session ? v.session : action.payload.session)

      forEach(groupedBySession, (validators, session) => {
        const _group_ids = uniq(validators.map(v => toNumber(v.para.group))).sort((a, b) => a - b)
        const _mvrs = validators.map(v => calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv));
        const _validity_votes = validators.map(v => v.para_summary.ev + v.para_summary.iv + v.para_summary.mv);
        const _backing_points = validators.map(v => ((v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20)) > 0 ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0);
        adapter.upsertOne(state, { six: parseInt(session, 10), _group_ids, _mvrs, _validity_votes, _backing_points})
      })

    })
    .addMatcher(matchParachainsReceived, (state, action) => {
      adapter.upsertOne(state, { six: action.payload.session, _parachainIds: action.payload.data.map(p => p.pid)})
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
export const selectValGroupIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session)._group_ids) ? selectSessionByIndex(state, session)._group_ids : []) : [];
export const selectParachainIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session)._parachainIds) ? selectSessionByIndex(state, session)._parachainIds : []) : [];
export const selectMVRsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session)._mvrs) ? selectSessionByIndex(state, session)._mvrs : []) : [];
export const selectValidityVotesBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session)._validity_votes) ? selectSessionByIndex(state, session)._validity_votes : []) : [];
export const selectBackingPointsBySession = (state, session) => !!selectSessionByIndex(state, session) ? (isArray(selectSessionByIndex(state, session)._backing_points) ? selectSessionByIndex(state, session)._backing_points : []) : [];
export const selectParaValidatorIdsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorIdsBySessionAndGroupId(state, session, groupId)) : []
export const selectParaValidatorsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorsBySessionAndGroupId(state, session, groupId)) : []
// from session.stats

export const selectMvrBySessions = (state, sessionIds = []) => sessionIds.map(id => {
  const session = selectSessionByIndex(state, id);
  if (!isUndefined(session)) {
    return session._mvr
  }
})

export const selectBackingPointsBySessions = (state, sessionIds = []) => sessionIds.map(id => {
  const session = selectSessionByIndex(state, id);
  if (!isUndefined(session)) {
    if (session.stats) {
      return session.stats.pt - (session.stats.ab * 20); 
    }
  }
}).filter(v => !isUndefined(v))

export const selectAuthoredBlocksBySessions = (state, sessionIds = []) => sessionIds.map(id => {
  const session = selectSessionByIndex(state, id);
  if (!isUndefined(session)) {
    if (session.stats) {
      return session.stats.ab; 
    }
  }
}).filter(v => !isUndefined(v))

export const { sessionHistoryChanged } = sessionsSlice.actions;

export default sessionsSlice;