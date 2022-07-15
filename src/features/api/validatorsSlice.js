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
    getValidators: builder.query({
      query: ({session, role}) => ({
        url: `/validators`,
        params: { session, role }
      }),
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      transformResponse: responseData => {
        return responseData.data
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          if (params.role === "para_authority") {
            const msg1 = JSON.stringify({ method: 'subscribe_para_authorities', params: [params.session.toString()] });
            dispatch(socketActions.submitMessage(msg1))
            // TODO see how to better unsubscribe previous session.. for now just be explicit here
            // NOTE: wait for at least one block so that is_para returns to false for validators no lonegr in session
            setTimeout(() => {
              const msg2 = JSON.stringify({ method: 'unsubscribe_para_authorities', params: [(params.session - 1).toString()] });
              dispatch(socketActions.submitMessage(msg2))
            }, 30000)
            
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.submitMessage(msg))
        }
      },
    }),
    getValidatorByAddress: builder.query({
      query: (address) => `/validators/${address}`,
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      async onQueryStarted(address, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // `onSuccess` subscribe for updates
          const msg = JSON.stringify({ method: "subscribe_validator", params: [address] });
          dispatch(socketActions.submitMessage(msg))
          if (data.is_para) {
            data.para.peers.forEach((peer) => {
              dispatch(extendedApi.endpoints.getValidatorPeerByAuthority.initiate({address, peer}, {forceRefetch: true}))
            })
          }
        } catch (err) {
          // `onError` side-effect
          // dispatch(socketActions.submitMessage(msg))
        }
      },
    }),
    getValidatorPeerByAuthority: builder.query({
      query: ({address, peer}) => `/validators/${address}/peers/${peer}`,
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
      async onQueryStarted({ address }, { dispatch, queryFulfilled }) {
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
  selectId: (data) => data.auth.address,
})

const matchValidatorReceived = isAnyOf(
  socketValidatorReceived,
  extendedApi.endpoints.getValidatorByAddress.matchFulfilled,
  extendedApi.endpoints.getValidatorPeerByAuthority.matchFulfilled
)

const matchValidatorsReceived = isAnyOf(
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
      const validators = action.payload.map(validator => ({
        ...validator,
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
  selectById: selectValidatorByAddress
} = adapter.getSelectors(state => state.validators)