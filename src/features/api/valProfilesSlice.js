import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import apiSlice from './apiSlice'
import { 
  matchValidatorsReceived,
 } from './validatorsSlice'
import { stashDisplay, commissionDisplay } from '../../util/display'

export const extendedApi = apiSlice.injectEndpoints({
  tagTypes: ['ValProfiles'],
  endpoints: (builder) => ({
    getValidatorProfileByAddress: builder.query({
      query: (address) => ({
        url: `/validators/${address}/profile`,
      }),
      providesTags: (result, error, arg) => [{ type: 'ValProfiles', id: arg }],
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
  name: 'val_profiles',
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
    .addMatcher(matchValidatorsReceived, (state, action) => {
      const setKey = (action, suffix = 'ranking') => {
        if (!isUndefined(action)) {
          if (!isUndefined(action.meta)) {
            if (!isUndefined(action.meta.arg)) {
              if (!isUndefined(action.meta.arg.originalArgs)) {
                if (!isUndefined(action.meta.arg.originalArgs.ranking)) {
                  return `_${action.meta.arg.originalArgs.ranking}_${suffix}`
                }
              }
            }
          }
        }
        return suffix
      }

      const profiles = action.payload.data.filter(validator => !!validator.profile)
          .map(validator => {
            let obj = {
              ...validator.profile,
            };
            if (validator.ranking) {
              obj = {
                ...obj,
                [setKey(action)]: validator.ranking
              }
            }
            return {
              ...obj,
              _commission: !!validator.profile.commission ? commissionDisplay(validator.profile.commission) : '',
              _identity: !!validator.profile.identity ? 
                (!!validator.profile.identity.sub ? 
                  `${validator.profile.identity.name}/${validator.profile.identity.sub}` : 
                  `${validator.profile.identity.name}`) 
                : stashDisplay(validator.profile.stash, 4),
              _ts: + new Date()
            }
          })
      adapter.upsertMany(state, profiles)
    })
  }
})

export default valProfilesSlice;

// Selectors

export const { 
  selectById: selectValProfileByAddress 
} = adapter.getSelectors(state => state.val_profiles)