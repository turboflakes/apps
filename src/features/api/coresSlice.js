import {
  createSlice,
  createEntityAdapter,
  current
} from '@reduxjs/toolkit'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'
import isUndefined from 'lodash/isUndefined'
import { calculateMVR } from '../../util/mvr'
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

const coresSlice = createSlice({
  name: 'cores',
  initialState: adapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
    .addMatcher(matchValidatorsReceived, (state, action) => {
      let currentState = current(state);

      // Filter validators if authority and p/v
      const filtered = action.payload.data.filter(v => v.is_auth && v.is_para && !isUndefined(v.para_summary));
      
      // Group validators by session first
      const groupedBySession = groupBy(filtered, v => !!v.session ? v.session : action.payload.session)

      forEach(groupedBySession, (validators, session) => {

        // Group validators by coreID
        const groupedByCoreId = groupBy(validators, v => v.para.core);

        
        
        const cores = Object.values(groupedByCoreId).map(group => ({
          id: `${session}_${group[0].para.core}`,
          _core_id: group[0].para.core,
          _para_id: group[0].para.pid,
          _validatorIds: group.map(v => `${session}_${v.address}`),
          // _core_assignments: !isUndefined(group[0].para_summary) ? group[0].para_summary.ca : 0,
          _mvr: group.map(v => calculateMVR(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv)).reduce((a, b) => a + b, 0) / group.length,
          // _validity_ev: group.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0),
          // _validity_iv: group.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0),
          // _validity_mv: group.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0),
          // _validity_votes: group.map(v => v.para_summary.ev + v.para_summary.iv + v.para_summary.mv).reduce((a, b) => a + b, 0),
          // _backing_points: parseInt(group.map(v => ((v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20)) ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0).reduce((a, b) => a + b, 0)  / group.length)
        }))
        adapter.upsertMany(state, cores)
      })
    })
  }
})

export default coresSlice;

// Selectors
const { 
  selectById,
} = adapter.getSelectors(state => state.cores)

export const selectCoreBySessionAndCoreId = (state, session, coreId) => selectById(state, `${session}_${coreId}`);

// export const selectValidatorIdsBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._validatorIds) ? selectById(state, `${session}_${groupId}`)._validatorIds : []) : [];

// export const selectValGroupParaIdBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._para_id) ? selectById(state, `${session}_${groupId}`)._para_id : undefined) : undefined;

// export const selectValGroupMvrBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
// (!isUndefined(selectById(state, `${session}_${groupId}`)._mvr) ? selectById(state, `${session}_${groupId}`)._mvr : undefined) : undefined;

// export const selectValGroupValidityExplicitVotesBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._validity_ev) ? selectById(state, `${session}_${groupId}`)._validity_ev : 0) : 0;

// export const selectValGroupValidityImplicitVotesBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._validity_iv) ? selectById(state, `${session}_${groupId}`)._validity_iv : 0) : 0;

// export const selectValGroupValidityMissedVotesBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._validity_mv) ? selectById(state, `${session}_${groupId}`)._validity_mv : 0) : 0;

// export const selectValGroupValidityVotesBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._validity_votes) ? selectById(state, `${session}_${groupId}`)._validity_votes : 0) : 0;

// export const selectValGroupBackingPointsBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._backing_points) ? selectById(state, `${session}_${groupId}`)._backing_points : 0) : 0;

// export const selectValGroupCoreAssignmentsBySessionAndGroupId = (state, session, groupId) => !isUndefined(selectById(state, `${session}_${groupId}`)) ? 
//   (!isUndefined(selectById(state, `${session}_${groupId}`)._core_assignments) ? selectById(state, `${session}_${groupId}`)._core_assignments : 0) : 0;


// export const selectValidatorsBySessionAndGroupId = (state, session, groupId) => 
//   selectValidatorIdsBySessionAndGroupId(state, session, groupId).map(id => { 
//     const validator = selectValidatorById(state, id);
//     return {
//       ...validator,
//       profile: selectValProfileByAddress(state, validator.address)
//     }
//   });