import {
  createSlice,
  createEntityAdapter,
  current
} from '@reduxjs/toolkit'
import isUndefined from 'lodash/isUndefined'
import apiSlice from './apiSlice'
import { 
  matchValidatorsReceived,
} from './validatorsSlice'
import { 
  matchBoardsReceived,
 } from './boardsSlice'
import {
  selectBoardAddressesBySessionAndHash
} from '../api/boardsSlice'
import { stashDisplay, commissionDisplay } from '../../util/display'
import { gradient } from '../../util/gradients';

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
          : action.payload.stash,
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
          // generate a gradient
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
    .addMatcher(matchBoardsReceived, (state, action) => {
      // NOTE: when a new board is received (NOMI) update/create profiles with a new gradient
      // TODO: don't change gradient if it has already been assigned, this could be obtain from current state
      let currentState = current(state);
      const profiles = action.payload.data[0].addresses.map(a => {
        const g = gradient();
        return {
          stash: a,
          colorStart: g.start,
          colorEnd: g.end
        }
      })
      adapter.upsertMany(state, profiles)
    })
  }
})

export default valProfilesSlice;

// Selectors

export const { 
  selectAll,
  selectById: selectValProfileByAddress 
} = adapter.getSelectors(state => state.val_profiles)