import {
  createSlice,
  createEntityAdapter,
  current
} from '@reduxjs/toolkit'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import { calculateMvr } from '../../util/mvr'
import { 
  matchValidatorReceived,
  matchValidatorsReceived,
  selectValidatorById
} from './validatorsSlice'
import { 
  selectValProfileByAddress,
} from './valProfilesSlice'


// Slice

const adapter = createEntityAdapter()

const valGroupsSlice = createSlice({
  name: 'valGroups',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchValidatorReceived, (state, action) => {
      if (action.payload.is_auth && action.payload.is_para) {
        const _state = current(state)
        const session = action.payload.session;
        const groupId = action.payload.para.group;
        const address = action.payload.address;
        const id = `${session}_${groupId}`;
        if (!!_state.entities[id]) {
          if (!_state.entities[id]._validatorIds.includes(`${session}_${address}`)) {
            const _validatorIds = [..._state.entities[id]._validatorIds, `${session}_${address}`]
            adapter.upsertOne(state, { 
              id,
              session,
              _validatorIds
            })
          }
        } else {
          adapter.upsertOne(state, { 
            id, 
            session,
            _validatorIds: [`${session}_${address}`]
          })
        }
      }
    })
    .addMatcher(matchValidatorsReceived, (state, action) => {
      // Filter validators if authority and p/v
      const filtered = action.payload.data.filter(v => v.is_auth && v.is_para);
      
      // Group validators by session first
      const groupedBySession = groupBy(filtered, v => !!v.session ? v.session : action.payload.session)

      forEach(groupedBySession, (validators, session) => {

        // Group validators by groupID
        const groupedByValGroupId = groupBy(validators, v => v.para.group);
        
        const groups = Object.values(groupedByValGroupId).map(group => ({
          id: `${session}_${group[0].para.group}`,
          _validatorIds: group.map(v => `${session}_${v.address}`),
          _mvrs: group.map(v => calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv))
        }))
        adapter.upsertMany(state, groups)
      })
    })
  }
})

export default valGroupsSlice;

// Selectors
const { 
  selectById,
} = adapter.getSelectors(state => state.valGroups)

export const selectValidatorIdsBySessionAndGroupId = (state, session, groupId) => !!selectById(state, `${session}_${groupId}`) ? 
  (!!selectById(state, `${session}_${groupId}`)._validatorIds ? selectById(state, `${session}_${groupId}`)._validatorIds : []) : [];

export const selectValidatorMvrsBySessionAndGroupId = (state, session, groupId) => !!selectById(state, `${session}_${groupId}`) ? 
  (!!selectById(state, `${session}_${groupId}`)._mvrs ? selectById(state, `${session}_${groupId}`)._mvrs : []) : [];

export const selectValidatorsBySessionAndGroupId = (state, session, groupId) => 
  selectValidatorIdsBySessionAndGroupId(state, session, groupId).map(id => { 
    const validator = selectValidatorById(state, id);
    return {
      ...validator,
      profile: selectValProfileByAddress(state, validator.address)
    }
  });