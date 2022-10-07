import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import BackingPieChart from './BackingPieChart';
import {
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import { stashDisplay, nameDisplay } from '../util/display'

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ValGroupPieCharts({sessionIndex, groupId}) {
  const selectedAddress = useSelector(selectAddress);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let filtered = validators.filter(v => v.address !== selectedAddress)
  filtered.splice(0,0,validators.find(v => v.address === selectedAddress));

  const data = filtered.map(v => createBackingPieData(
    v.para_summary.ev, 
    v.para_summary.iv, 
    v.para_summary.mv, 
    nameDisplay(!!v.profile ? v.profile._identity : stashDisplay(v.address, 4), 24, selectedAddress === v.address ? '★ ' : '')))

  return (
    <Paper sx={{ p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 200,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Attestations of validity</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around'}}>
        {data.map((o, i) => 
          (<BackingPieChart key={i} data={o} showLegend />)
        )}
      </Box>
    </Paper>
  );
}