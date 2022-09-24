import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { 
  matchValidatorReceived,
  matchValidatorsReceived
} from './validatorsSlice'


// Slice

const adapter = createEntityAdapter()

const identitiesSlice = createSlice({
  name: 'identities',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchValidatorReceived, (state, action) => {
      if (action.payload.is_auth) {
        adapter.upsertOne(state, { 
          id: action.payload.address, 
          identity: action.payload.identity
        })
      }
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      const validators = action.payload.data.filter(validator => !!validator.is_auth)
          .map(validator => ({ 
            id: validator.address, 
            identity: validator.identity
          }))
      adapter.upsertMany(state, validators)
    })
  }
})

export default identitiesSlice;

// Selectors

const { 
  selectById 
} = adapter.getSelectors(state => state.identities)

export const selectIdentityByAddress = (state, address) => selectById(state, address).identity