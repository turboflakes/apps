import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
} from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
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
  selectParachainBySessionAndParaId,
  matchParachainsReceived,
} from './parachainsSlice'
import { 
  selectValGroupBySessionAndGroupId,
  selectValidatorsBySessionAndGroupId,
  selectValidatorIdsBySessionAndGroupId,
} from './valGroupsSlice'
import { 
  selectFinalizedBlock 
} from './blocksSlice'
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
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          if (id === "current") {
            const msg = JSON.stringify({ method: "subscribe_session", params: ["new"] });
            dispatch(socketActions.messageQueued(msg))
            // Fetch previous sessions stats for the current era
            dispatch(extendedApi.endpoints.getSessions.initiate({number_last_sessions: data.esix - 1, show_stats: true}))
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
  sortComparer: (a, b) => a.six > b.six,
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
    sessionHistoryRangeChanged: (state, action) => {
      state.history_range = action.payload;
    },
    sessionHistoryIdsChanged: (state, action) => {
      state.history_ids = action.payload;
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
      const filtered = action.payload.data.filter(v => v.is_auth);

      // Group validators by session first
      const groupedBySession = groupBy(filtered, v => !!v.session ? v.session : action.payload.session)

      forEach(groupedBySession, (validators, session) => {
        const _group_ids = uniq(validators.filter(v => v.is_auth && v.is_para).map(v => toNumber(v.para.group))).sort((a, b) => a - b)
        const _mvrs = validators.filter(v => v.is_auth && v.is_para).map(v => !isUndefined(v.para_summary) ? calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv) : undefined);
        const _validity_votes = validators.filter(v => v.is_auth && v.is_para).map(v => !isUndefined(v.para_summary) ? v.para_summary.ev + v.para_summary.iv + v.para_summary.mv : 0);
        const _backing_points = validators.filter(v => v.is_auth && v.is_para).map(v => ((v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20)) > 0 ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0);
        const _stashes = validators.map(v => v.address);
        adapter.upsertOne(state, { six: parseInt(session, 10), _group_ids, _mvrs, _validity_votes, _backing_points, _stashes})
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
export const selectSessionHistoryRange = (state) => state.sessions.history_range;
export const selectSessionHistoryIds = (state) => isUndefined(state.sessions.history_ids) ? buildSessionIdsArrayHelper(state.sessions.current - 1, 6) : state.sessions.history_ids;
export const selectSessionCurrent = (state) => state.sessions.current;

export const selectValGroupIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
  (isArray(selectSessionByIndex(state, session)._group_ids) ? 
    selectSessionByIndex(state, session)._group_ids : []) : [];

export const selectValGroupIdsBySessionSortedBy = (state, session, sortBy) => {
  switch (sortBy) {
    case 'backing_points': {
      const group_ids = selectValGroupIdsBySession(state, session)
        .map(group_id => selectValGroupBySessionAndGroupId(state, session, group_id))
        .sort((a, b) => b._backing_points - a._backing_points)
        .map(o => o._group_id);
      return group_ids
    }
    case 'mvr': {
      const group_ids = selectValGroupIdsBySession(state, session)
        .map(group_id => selectValGroupBySessionAndGroupId(state, session, group_id))
        .sort((a, b) => b._mvr - a._mvr)
        .map(o => o._group_id);
      return group_ids
    }
    default: {
      return selectValGroupIdsBySession(state, session)
    }
  }
};

export const selectParachainIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
  (isArray(selectSessionByIndex(state, session)._parachainIds) ? 
    selectSessionByIndex(state, session)._parachainIds : []) : [];

export const selectParachainIdsBySessionSortedBy = (state, session, sortBy) => {
  switch (sortBy) {
    case 'backing_points': {
      const para_ids = selectParachainIdsBySession(state, session)
        .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
        .sort((a, b) => b._backing_points - a._backing_points)
        .map(o => o.pid);
      return para_ids
    }
    case 'mvr': {
      const para_ids = selectParachainIdsBySession(state, session)
        .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
        .sort((a, b) => b._mvr - a._mvr)
        .map(o => o.pid);
      return para_ids
    }
    default: {
      return selectParachainIdsBySession(state, session)
    }
  }
};

export const selectScheduledParachainsBySession = (state, session) => {
  return selectParachainIdsBySession(state, session)
        .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
        .filter(para => !isUndefined(para) && !isNull(para.group))
        .length
}

export const selectMVRsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
  (isArray(selectSessionByIndex(state, session)._mvrs) ? 
    selectSessionByIndex(state, session)._mvrs : []) : [];

export const selectValidityVotesBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
  (isArray(selectSessionByIndex(state, session)._validity_votes) ? 
    selectSessionByIndex(state, session)._validity_votes : []) : [];

export const selectBackingPointsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
  (isArray(selectSessionByIndex(state, session)._backing_points) ? 
    selectSessionByIndex(state, session)._backing_points : []) : [];

export const selectParaValidatorIdsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? 
  selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorIdsBySessionAndGroupId(state, session, groupId)) : [];

export const selectParaValidatorsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? 
  selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorsBySessionAndGroupId(state, session, groupId)) : [];

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

export const selectTotalPointsBySessions = (state, sessionIds = []) => sessionIds.map(id => {
  const session = selectSessionByIndex(state, id);
  if (!isUndefined(session)) {
    if (session.stats) {
      return session.stats.pt; 
    }
  }
}).filter(v => !isUndefined(v))

export const  selectAuthoredBlocksBySessions = (state, sessionIds = []) => sessionIds.map(id => {
  const session = selectSessionByIndex(state, id);
  if (!isUndefined(session)) {
    if (session.stats) {
      return session.stats.ab; 
    }
  }
}).filter(v => !isUndefined(v))

// Era
export const selectEraPointsBySession = (state, sessionId) => {
  const session = selectSessionByIndex(state, sessionId)
  if (!isUndefined(session)) {
    // Calculate previous sessions points
    let sessionIds = []
    for (let i = 1; i < session.esix; i++) {
      sessionIds.push(session.six - i);
    }
    let previousSessionsPoints = selectTotalPointsBySessions(state, sessionIds).reduce((a, b) => a + b, 0);
    // Get current session points from last finalized block
    const block = selectFinalizedBlock(state)
    if (!isUndefined(block)) {
      if (!isUndefined(block.stats)) {
        return previousSessionsPoints + block.stats.pt
      }
    }
    return previousSessionsPoints
  }
  return 0
}

export const buildSessionIdsArrayHelper = (startSession, max = 0) => {
  if (isNaN(startSession)) {
    return []
  }
  let out = [];
  for (let i = max - 1; i >= 0; i--) {
    out.push(startSession-i);
  }
  return out;
}

export const { sessionHistoryChanged, sessionHistoryRangeChanged, sessionHistoryIdsChanged } = sessionsSlice.actions;

export default sessionsSlice;