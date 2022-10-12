import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'
import { 
  selectSessionByIndex } from './sessionsSlice'
import {
  selectIsLiveMode
} from '../layout/layoutSlice'
import {
  selectValGroupMvrBySessionAndGroupId
} from './valGroupsSlice'


export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Validators'],
  endpoints: (builder) => ({
    getValidators: builder.query({
      query: ({address, session, role, number_last_sessions, show_summary, show_stats, show_profile, fetch_peers}) => ({
        url: `/validators`,
        params: { address, session, role, number_last_sessions, show_summary, show_stats, show_profile, fetch_peers }
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

// export const selectValidatorsAllBySessionAndAddress = (state, session, address) => selectValidatorById(state, `${session}_${address}`)

export const buildSessionIdsArrayHelper = (startSession, max = 0) => {
  let out = [];
  for (let i = max - 1; i >= 0; i--) {
    out.push(startSession-i);
  }
  return out;
}