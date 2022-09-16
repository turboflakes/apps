import {
  createSlice,
  createEntityAdapter,
  current
} from '@reduxjs/toolkit'
import groupBy from 'lodash/groupBy'
import { calculateMvr } from '../../util/mvr'
import { 
  matchValidatorReceived,
  matchValidatorsReceived,
  selectValidatorById
} from './validatorsSlice'


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
      
      // Group validators by groupID
      const groupedByValGroupId = groupBy(filtered, v => v.para.group);
      
      const groups = Object.values(groupedByValGroupId).map(g => ({
        id: !!g[0].session ? `${g[0].session}_${g[0].para.group}` : `${action.payload.session}_${g[0].para.group}`,
        _validatorIds: g.map(v => !!v.session ? `${v.session}_${v.address}` : `${action.payload.session}_${v.address}`)
      }))
      adapter.upsertMany(state, groups)
    })
  }
})

export default valGroupsSlice;

// Selectors
const { 
  selectById,
} = adapter.getSelectors(state => state.valGroups)

export const selectValidatorIdsBySessionAndGroupId = (state, session, groupId) => !!selectById(state, `${session}_${groupId}`) ? 
  selectById(state, `${session}_${groupId}`)._validatorIds : [];
  
export const selectValidatorsBySessionAndGroupId = (state, session, groupId) => !!selectById(state, `${session}_${groupId}`) ? 
  selectById(state, `${session}_${groupId}`)._validatorIds.map(id => selectValidatorById(state, id))
  : [];

export const selectValGroupMvrBySessionAndGroupId = (state, session, groupId) => {
  if (!!selectById(state, `${session}_${groupId}`)) {
    const ev = selectById(state, `${session}_${groupId}`)._validatorIds.map(id => selectValidatorById(state, id).para_summary.ev).reduce((a, b) => a + b, 0);
    const iv = selectById(state, `${session}_${groupId}`)._validatorIds.map(id => selectValidatorById(state, id).para_summary.iv).reduce((a, b) => a + b, 0);
    const mv = selectById(state, `${session}_${groupId}`)._validatorIds.map(id => selectValidatorById(state, id).para_summary.mv).reduce((a, b) => a + b, 0);
    return calculateMvr(ev, iv, mv)
  }
};