import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import apiSlice from './apiSlice'
import { stashDisplay, commissionDisplay } from '../../util/display'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['Validators'],
  endpoints: (builder) => ({
    getValidatorProfileByAddress: builder.query({
      query: (address) => ({
        url: `/validators/${address}/profile`,
      }),
      providesTags: (result, error, arg) => [{ type: 'Validators', id: arg }],
    }),
  }),
})

export const {
  useGetValidatorProfileByAddressQuery,
} = extendedApi

// Slice
const adapter = createEntityAdapter({
  selectId: (data) => data.stash,
})

const valProfilesSlice = createSlice({
  name: 'valProfiles',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
  builder
    .addMatcher(extendedApi.endpoints.getValidatorProfileByAddress.matchFulfilled, (state, action) => {
      adapter.upsertOne(state, { 
        ...action.payload, 
        _commission: !!action.payload.commission ? commissionDisplay(action.payload.commission) : '',
        _identity: !!action.payload.identity ? 
          (!!action.payload.identity.sub ? 
            `${action.payload.identity.name}/${action.payload.identity.sub}` : 
            `${action.payload.identity.name}`) 
          : stashDisplay(action.payload.stash),
        _ts: + new Date()})
    })
  }
})

export default valProfilesSlice;

// Selectors

export const { 
  selectById: selectValProfileByAddress 
} = adapter.getSelectors(state => state.valProfiles)