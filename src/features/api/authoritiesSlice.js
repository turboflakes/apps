import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { 
  matchValidatorReceived,
  matchValidatorsReceived,
  selectValidatorById
 } from './validatorsSlice'


// Slice

const adapter = createEntityAdapter()

const authoritiesSlice = createSlice({
  name: 'authorities',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchValidatorReceived, (state, action) => {
      if (action.payload.is_auth) {
        adapter.upsertOne(state, { 
          id: `${action.payload.session}_${action.payload.auth.aix}`, 
          validatorId: `${action.payload.session}_${action.payload.address}`
        })
      }
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      const validators = action.payload.data.filter(validator => !!validator.is_auth)
          .map(validator => ({ 
            id: `${action.payload.session}_${validator.auth.aix}`, 
            validatorId: `${action.payload.session}_${validator.address}`
          }))
      adapter.upsertMany(state, validators)
    })
  }
})

export default authoritiesSlice;

// Selectors
export const { 
  selectById,
} = adapter.getSelectors(state => state.authorities)

export const selectValidatorBySessionAndAuthId = (state, session, authId) => selectValidatorById(state, selectById(state, `${session}_${authId}`).validatorId);