import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf,
  current
} from '@reduxjs/toolkit'
import uniq from 'lodash/uniq'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import toNumber from 'lodash/toNumber'
import isArray from 'lodash/isArray'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import union from 'lodash/union'
import apiSlice from './apiSlice'
import { 
  selectSessionByIndex,
  selectPoolIdsBySession
} from './sessionsSlice'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Pools'],
  endpoints: (builder) => ({
    getPools: builder.query({
      query: ({session, number_last_sessions, from, to, show_metadata, show_stats, show_nomstats}) => ({
        url: `/pools`,
        params: { session, number_last_sessions, from, to, show_metadata, show_stats, show_nomstats }
      }),
      providesTags: (result, error, arg) => [{ type: 'Pools', id: arg }],
    }),
    // getSessionByIndex: builder.query({
    //   query: (index) => `/sessions/${index}`,
    //   providesTags: (result, error, arg) => [{ type: 'Sessions', id: arg }],
    //   async onQueryStarted(id, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled
    //       // `onSuccess` subscribe for updates
    //       if (id === "current") {
    //         const msg = JSON.stringify({ method: "subscribe_session", params: ["new"] });
    //         dispatch(socketActions.messageQueued(msg))
    //         // Fetch previous sessions stats for the current era
    //         dispatch(extendedApi.endpoints.getSessions.initiate({number_last_sessions: data.esix - 1, show_stats: true}))
    //       }
    //     } catch (err) {
    //       // `onError` side-effect
    //       // dispatch(socketActions.messageQueued(msg))
    //     }
    //   },
    // }),
  }),
})

export const {
  useGetPoolsQuery,
  // useGetSessionByIndexQuery,
} = extendedApi

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.id}`,
})

export const matchPoolsReceived = isAnyOf(
  extendedApi.endpoints.getPools.matchFulfilled
)

const poolsSlice = createSlice({
  name: 'pools',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    // .addMatcher(matchSessionReceived, (state, action) => {
    //   // update session current from sessionReceived (needed when new session is received)
    //   if (action.payload.is_current) {
    //     state.current = action.payload.six
    //   }
    //   // update session with timestamp
    //   adapter.upsertOne(state, { ...action.payload, _ts: + new Date()})
    // })
    .addMatcher(matchPoolsReceived, (state, action) => {
      const pools = action.payload.data.map(pool => ({
        ...pool,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, pools)
    })
  }
})

// Selectors
export const { 
  selectAll: selectPoolsAll,
  selectById: selectPoolById
} = adapter.getSelectors(state => state.pools)


export const selectTotalMembersBySession = (state, session) => selectPoolIdsBySession(state, session)
  .map(id => {
    const pool = selectPoolById(state, `${session}_${id}`)
    return !isUndefined(pool.stats) ? pool.stats.member_counter : 0;
  })
  .reduce((a, b) => a + b, 0)

export const selectTotalPointsBySession = (state, session) => selectPoolIdsBySession(state, session)
  .map(id => {
    const pool = selectPoolById(state, `${session}_${id}`)
    return !isUndefined(pool.stats) ? pool.stats.points : 0;
  })
  .reduce((a, b) => a + b, 0)


// export const selectValGroupIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
// export const selectValGroupIdsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._group_ids) ? 
//     selectSessionByIndex(state, session)._group_ids : []) : [];

// export const selectValGroupIdsBySessionSortedBy = (state, session, sortBy) => {
//   switch (sortBy) {
//     case 'backing_points': {
//       const group_ids = selectValGroupIdsBySession(state, session)
//         .map(group_id => selectValGroupBySessionAndGroupId(state, session, group_id))
//         .sort((a, b) => b._backing_points - a._backing_points)
//         .map(o => o._group_id);
//       return group_ids
//     }
//     case 'mvr': {
//       const group_ids = selectValGroupIdsBySession(state, session)
//         .map(group_id => selectValGroupBySessionAndGroupId(state, session, group_id))
//         .sort((a, b) => b._mvr - a._mvr)
//         .map(o => o._group_id);
//       return group_ids
//     }
//     default: {
//       return selectValGroupIdsBySession(state, session)
//     }
//   }
// };



// export const selectParachainIdsBySessionSortedBy = (state, session, sortBy) => {
//   switch (sortBy) {
//     case 'backing_points': {
//       const para_ids = selectParachainIdsBySession(state, session)
//         .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
//         .sort((a, b) => b._backing_points - a._backing_points)
//         .map(o => o.pid);
//       return para_ids
//     }
//     case 'mvr': {
//       const para_ids = selectParachainIdsBySession(state, session)
//         .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
//         .sort((a, b) => b._mvr - a._mvr)
//         .map(o => o.pid);
//       return para_ids
//     }
//     default: {
//       return selectParachainIdsBySession(state, session)
//     }
//   }
// };

// export const selectScheduledParachainsBySession = (state, session) => {
//   return selectParachainIdsBySession(state, session)
//         .map(para_id => selectParachainBySessionAndParaId(state, session, para_id))
//         .filter(para => !isUndefined(para) && !isNull(para.group))
//         .length
// }

// export const selectMVRsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._mvrs) ? 
//     selectSessionByIndex(state, session)._mvrs : []) : [];

// export const selectDisputesBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._dispute_stashes) ? 
//     selectSessionByIndex(state, session)._dispute_stashes : []) : [];

// export const selectLowGradesBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._f_grade_stashes) ? 
//     selectSessionByIndex(state, session)._f_grade_stashes : []) : [];

// export const selectValidityVotesBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._validity_votes) ? 
//     selectSessionByIndex(state, session)._validity_votes : []) : [];

// export const selectBackingPointsBySession = (state, session) => !!selectSessionByIndex(state, session) ? 
//   (isArray(selectSessionByIndex(state, session)._backing_points) ? 
//     selectSessionByIndex(state, session)._backing_points : []) : [];

// export const selectParaValidatorIdsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? 
//   selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorIdsBySessionAndGroupId(state, session, groupId)) : [];

// export const selectParaValidatorsBySessionGrouped = (state, session) => !!selectSessionByIndex(state, session) ? 
//   selectSessionByIndex(state, session)._group_ids.map(groupId => selectValidatorsBySessionAndGroupId(state, session, groupId)) : [];

// export const selectMvrBySessions = (state, sessionIds = []) => sessionIds.map(id => {
//   const session = selectSessionByIndex(state, id);
//   if (!isUndefined(session)) {
//     return session._mvr
//   }
// })

// export const selectBackingPointsBySessions = (state, sessionIds = []) => sessionIds.map(id => {
//   const session = selectSessionByIndex(state, id);
//   if (!isUndefined(session)) {
//     if (!isUndefined(session.stats)) {
//       return session.stats.pt - (session.stats.ab * 20); 
//     }
//   }
// }).filter(v => !isUndefined(v))

// export const selectTotalPointsBySessions = (state, sessionIds = []) => sessionIds.map(id => {
//   const session = selectSessionByIndex(state, id);
//   if (!isUndefined(session)) {
//     if (!isUndefined(session.stats)) {
//       return session.stats.pt; 
//     }
//   }
// }).filter(v => !isUndefined(v))

// export const  selectAuthoredBlocksBySessions = (state, sessionIds = []) => sessionIds.map(id => {
//   const session = selectSessionByIndex(state, id);
//   if (!isUndefined(session)) {
//     if (!isUndefined(session.stats)) {
//       return session.stats.ab; 
//     }
//   }
// }).filter(v => !isUndefined(v))

// export const  selectDisputesBySessions = (state, sessionIds = []) => sessionIds.map(id => {
//   const session = selectSessionByIndex(state, id);
//   if (!isUndefined(session)) {
//     if (!isUndefined(session.stats)) {
//       return session.stats.di
//     }
//   }
// }).filter(v => !isUndefined(v))

// // Era
// export const selectEraPointsBySession = (state, sessionId) => {
//   const session = selectSessionByIndex(state, sessionId)
//   if (!isUndefined(session)) {
//     // Calculate previous sessions points
//     let sessionIds = []
//     for (let i = 1; i < session.esix; i++) {
//       sessionIds.push(session.six - i);
//     }
//     let previousSessionsPoints = selectTotalPointsBySessions(state, sessionIds).reduce((a, b) => a + b, 0);
//     // Get current session points from last finalized block
//     const block = selectFinalizedBlock(state)
//     if (!isUndefined(block)) {
//       if (!isUndefined(block.stats)) {
//         return previousSessionsPoints + block.stats.pt
//       }
//     }
//     return previousSessionsPoints
//   }
//   return 0
// }

// export const buildSessionIdsArrayHelper = (startSession, max = 0) => {
//   if (isNaN(startSession)) {
//     return []
//   }
//   let out = [];
//   for (let i = max - 1; i >= 0; i--) {
//     out.push(startSession-i);
//   }
//   return out;
// }

export default poolsSlice;