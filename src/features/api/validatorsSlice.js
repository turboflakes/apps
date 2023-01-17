import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import groupBy from 'lodash/groupBy'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'
import max from 'lodash/max'
import min from 'lodash/min'
import apiSlice from './apiSlice'
import { calculateMvr } from '../../util/mvr'
import { socketActions } from './socketSlice'
import { 
  selectSessionByIndex } from './sessionsSlice'
import {
  selectIsLiveMode
} from '../layout/layoutSlice'
import {
  selectValGroupMvrBySessionAndGroupId
} from './valGroupsSlice'
import {
  selectValProfileByAddress
} from './valProfilesSlice'


export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Validators'],
  endpoints: (builder) => ({
    getValidators: builder.query({
      query: ({address, session, sessions, role, number_last_sessions, show_summary, show_stats, show_profile, fetch_peers}) => ({
        url: `/validators`,
        params: { address, session, sessions, role, number_last_sessions, show_summary, show_stats, show_profile, fetch_peers }
      }),
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      async onQueryStarted(params, { getState, dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // `onSuccess` subscribe for updates
          const session = selectSessionByIndex(getState(), params.session)
          if (params.role === "para_authority" && session.is_current) {
            if (params.show_summary) {
              let msg = JSON.stringify({ method: 'subscribe_para_authorities_summary', params: [params.session.toString()] });
              dispatch(socketActions.messageQueued(msg))
              // NOTE: always unsubscribe previous session
              msg = JSON.stringify({ method: 'unsubscribe_para_authorities_summary', params: [(params.session - 1).toString()] });
              dispatch(socketActions.messageQueued(msg))
            } else if (params.show_stats) {
              let msg = JSON.stringify({ method: 'subscribe_para_authorities_stats', params: [params.session.toString()] });
              dispatch(socketActions.messageQueued(msg))
              // NOTE: always unsubscribe previous session
              msg = JSON.stringify({ method: 'unsubscribe_para_authorities_stats', params: [(params.session - 1).toString()] });
              dispatch(socketActions.messageQueued(msg))
            }
          }
          
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
    getValidatorByAddress: builder.query({
      query: ({address, session, show_summary, show_stats}) => ({
        url: `/validators/${address}`,
        params: { session, show_summary, show_stats }
      }),
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      async onQueryStarted({address, session, show_summary, show_stats}, { getState, dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          const isLiveMode = selectIsLiveMode(getState())
          if (isLiveMode) {
            const msg = JSON.stringify({ method: "subscribe_validator", params: [address.toString()] });
            dispatch(socketActions.messageQueued(msg))
          }
          if (data.is_para) {
            data.para.peers.forEach((peer) => {
              dispatch(extendedApi.endpoints.getValidatorPeerByAuthority.initiate({address, peer, session, show_summary, show_stats }, {forceRefetch: true}))
            })
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.messageQueued(msg))
        }
      },
    }),
    getValidatorPeerByAuthority: builder.query({
      query: ({address, peer, session, show_summary, show_stats}) => ({
        url: `/validators/${address}/peers/${peer}`,
        params: { session, show_summary, show_stats }
      }),
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      async onQueryStarted(_, { getState, dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          const isLiveMode = selectIsLiveMode(getState())
          if (isLiveMode && data.is_auth) {
            const msg = JSON.stringify({ method: "subscribe_validator", params: [data.address.toString()] });
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
  useGetValidatorsQuery,
  useGetValidatorByAddressQuery,
  useGetValidatorPeerByAuthorityQuery,
} = extendedApi

// Actions
export const socketValidatorReceived = createAction(
  'validators/validatorReceived'
)

export const socketValidatorsReceived = createAction(
  'validators/validatorsReceived'
)

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => `${data.session}_${data.address}`,
})

export const matchValidatorReceived = isAnyOf(
  socketValidatorReceived,
  extendedApi.endpoints.getValidatorByAddress.matchFulfilled,
  extendedApi.endpoints.getValidatorPeerByAuthority.matchFulfilled
)

export const matchValidatorsReceived = isAnyOf(
  socketValidatorsReceived,
  extendedApi.endpoints.getValidators.matchFulfilled
)

const validatorsSlice = createSlice({
  name: 'validators',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchValidatorReceived, (state, action) => {
      adapter.upsertOne(state, { ...action.payload, _ts: + new Date()})
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      const validators = action.payload.data.map(validator => ({
        ...validator,
        session: !!validator.session ? validator.session : action.payload.session,
        _ts: + new Date()
      }))
      adapter.upsertMany(state, validators)
    })
  }
})

export default validatorsSlice;

// Selectors
export const { 
  selectAll: selectValidatorsAll,
  selectById: selectValidatorById,
} = adapter.getSelectors(state => state.validators)

export const selectValidatorBySessionAndAddress = (state, session, address) => selectValidatorById(state, `${session}_${address}`)
export const selectValidatorsByAddressAndSessions = (state, address, sessions = [], exclude_partial_sessions = false) => 
  sessions.map(sessionId => {
    if (exclude_partial_sessions) {
      const session = selectSessionByIndex(state, sessionId);
      if (isUndefined(session)) return
    }
    const validator = selectValidatorById(state, `${sessionId}_${address}`);
    if (!isUndefined(validator)) {
      if (validator.is_para) {
        return {
          ...validator,
          _val_group_mvr: selectValGroupMvrBySessionAndGroupId(state, sessionId, validator.para.group)
        }
      }
      return {
        ...validator
      }
    }
  }).filter(v => !isUndefined(v))

export const selectParaAuthoritySessionsByAddressAndSessions = (state, address, sessions = []) => 
  selectValidatorsByAddressAndSessions(state, address, sessions)
    .filter(v => v.is_auth && v.is_para)
    .map(v => v.session);

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

function mergeArrays(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

const selectValidatorsBySessions = (state, sessions = []) => {
  let validators = {};
  sessions.forEach(sessionId => {
    const session = selectSessionByIndex(state, sessionId);
    if (!isUndefined(session) && !isUndefined(session._stashes)) {
      const a = session._stashes.map(s => selectValidatorBySessionAndAddress(state, sessionId, s))
      const b = groupBy(a, v => v.address);
      mergeWith(validators, b, mergeArrays);
    }
    
  });
  return Object.values(validators)
}

function createRows(id, identity, address, subset, 
  active_sessions, para_sessions, authored_blocks, core_assignments, 
  explicit_votes, implicit_votes, missed_votes, avg_pts, commission, timeline) {
  return {id, identity, address, subset, 
    active_sessions, para_sessions, authored_blocks, 
    core_assignments, explicit_votes, implicit_votes, missed_votes, 
    avg_pts, commission, timeline };
}

// SCORES
// https://github.com/turboflakes/one-t/blob/main/SCORES.md
// 
// Performance Score
// performance_score = (1 - mvr) * 0.75 + ((avg_pts - min_avg_pts) / (max_avg_pts - min_avg_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07

// Commission Score
// commission_score = performance_score * 0.25 + (1 - commission) * 0.75

const performance_score = (mvr, avg_pts, min_avg_pts, max_avg_pts, para_sessions, total_sessions) => {
  return (1 - mvr) * 0.75 + ((avg_pts - min_avg_pts) / (max_avg_pts - min_avg_pts)) * 0.18 + (para_sessions / total_sessions) * 0.07
}

// Timeline 
// 
// NOTE: MVR_LEVELS are configurable in ONE-T bot.
// Default values are: 
// fn default_mvr_level_1() -> u32 {
//   2000
// }
// fn default_mvr_level_2() -> u32 {
//   4000
// }
// fn default_mvr_level_3() -> u32 {
//   6000
// }
// fn default_mvr_level_4() -> u32 {
//   9000
// }
// They should be in sync to whatever is defined there.
// 
const MVR_LEVELS = [9000, 6000, 4000, 2000, -1];

const GLYPHS = {
  "waiting": "_",
  "active": "•",
  "activePVL0": "❚",
  "activePVL1": "❙",
  "activePVL2": "❘",
  "activePVL3": "!",
  "activePVL4": "¿",
  "activeIdle": "?",
  "NA": ".",
  fromMVR: function (mvr) {
    if (isUndefined(mvr)) {
      return this.activeIdle
    }
    const rounded = Math.round((1 - mvr) * 10000);
    const index = MVR_LEVELS.findIndex(l => rounded > l);
    return this[`activePVL${index}`]
  }
}

export const selectValidatorsInsightsBySessions = (state, sessions = [], filterValue) => {
  const validators = selectValidatorsBySessions(state, sessions);
  const rows = validators.map((x, i) => {
    const f1 = x.filter(y => y.is_auth);
    const authored_blocks = f1.map(v => v.auth.ab.length).reduce((a, b) => a + b, 0);
    const f2 = x.filter(y => y.is_auth && y.is_para);
    const para_points = f2.map(v => v.para_summary.pt - (v.para_summary.ab * 20)).reduce((a, b) => a + b, 0);
    const core_assignments = f2.map(v => v.para_summary.ca).reduce((a, b) => a + b, 0);
    const implicit_votes = f2.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0);
    const explicit_votes = f2.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0);
    const missed_votes = f2.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0);
    const profile = selectValProfileByAddress(state, x[0].address);
    const avg_pts = para_points / f2.length;

    const timeline = sessions.map(s => {
      const y = x.find(e => e.session === s);
      if (!isUndefined(y)) {
        if (y.is_auth && y.is_para) {
          const mvr = calculateMvr(y.para_summary.ev, y.para_summary.iv, y.para_summary.mv);
          return GLYPHS.fromMVR(mvr)
        } else if (y.is_auth) {
          return GLYPHS.active
        } else {
          return GLYPHS.NA
        }
      } else {
        return GLYPHS.waiting
      }
    });

    return createRows(
      i+1, 
      !isUndefined(profile) ? profile._identity : '-',
      x[0].address,
      !isUndefined(profile) ? profile.subset : '-', 
      f1.length,
      f2.length,
      authored_blocks, 
      core_assignments,
      explicit_votes, 
      implicit_votes, 
      missed_votes, 
      avg_pts,
      !isUndefined(profile) ? profile.commission : '-',
      timeline.join("")
    )
  })

  const min_avg_pts = min(rows.map(v => v.avg_pts));
  const max_avg_pts = max(rows.map(v => v.avg_pts));

  return rows.map(v => {
    const mvr = calculateMvr(v.explicit_votes, v.implicit_votes, v.missed_votes)
    return {
      ...v,
      mvr,
      score: performance_score(mvr, v.avg_pts, min_avg_pts, max_avg_pts, v.para_sessions, sessions.length)
    }
  })
  .filter(v => !isUndefined(v.identity) ? v.identity.toLowerCase().includes(filterValue.toLowerCase()) 
    || v.address.toLowerCase().includes(filterValue.toLowerCase()) : false)
}