import {
  createAction,
  createSlice,
  createEntityAdapter,
  isAnyOf
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { socketActions } from './socketSlice'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Validators'],
  endpoints: (builder) => ({
    getValidatorByStash: builder.query({
      query: (stash) => `/validators/${stash}`,
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      transformResponse: responseData => {
        return responseData.validator
      },
      async onQueryStarted(stash, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          const msg = JSON.stringify({ method: "subscribe_validator", params: [stash] });
          dispatch(socketActions.submitMessage(msg))
          if (data.is_para) {
            data.para.peers.forEach((peer) => {
              dispatch(extendedApi.endpoints.getValidatorPeerByAuthority.initiate({stash, peer}, {forceRefetch: true}))
            })
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.submitMessage(msg))
        }
      },
    }),
    getValidatorPeerByAuthority: builder.query({
      query: ({stash, peer}) => `/validators/${stash}/peers/${peer}`,
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      transformResponse: responseData => {
        return responseData.validator
      },
      async onQueryStarted({ stash }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          if (data.is_auth) {
            const msg = JSON.stringify({ method: "subscribe_validator", params: [data.auth.address] });
            dispatch(socketActions.submitMessage(msg))
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.submitMessage(msg))
        }
      },
    }),
  }),
})

export const {
  useGetValidatorByStashQuery,
  useGetValidatorPeerByAuthorityQuery,
} = extendedApi

// Actions
export const socketValidatorReceived = createAction(
  'validators/validatorReceived'
)

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.auth.address,
})

const matchValidatorReceived = isAnyOf(
  socketValidatorReceived,
  extendedApi.endpoints.getValidatorByStash.matchFulfilled,
  extendedApi.endpoints.getValidatorPeerByAuthority.matchFulfilled
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
  }
})

export default validatorsSlice;

// Selectors
export const { 
  selectAll: selectValidatorsAll,
  selectById: selectValidatorByStash
} = adapter.getSelectors(state => state.validators)