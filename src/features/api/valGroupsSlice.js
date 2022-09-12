import {
  createSlice,
  createEntityAdapter,
  current
} from '@reduxjs/toolkit'
import groupBy from 'lodash/groupBy'
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
          if (!_state.entities[id].validatorIds.includes(`${session}_${address}`)) {
            const validatorIds = [..._state.entities[id].validatorIds, `${session}_${address}`]
            
            adapter.upsertOne(state, { 
              id,
              session,
              validatorIds
            })
          }
        } else {
          adapter.upsertOne(state, { 
            id, 
            session,
            validatorIds: [`${session}_${address}`]
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
        id: `${action.payload.session}_${g[0].para.group}`,
        validatorIds: g.map(v => `${action.payload.session}_${v.address}`)
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
  selectById(state, `${session}_${groupId}`).validatorIds : [];
  
export const selectValidatorsBySessionAndGroupId = (state, session, groupId) => !!selectById(state, `${session}_${groupId}`) ? 
  selectById(state, `${session}_${groupId}`).validatorIds.map(id => selectValidatorById(state, id))
  : [];
