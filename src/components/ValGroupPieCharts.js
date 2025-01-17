import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import BackingPieChart from './BackingPieChart';
import L2PieChart from './L2PieChart';
import {
  selectAddress,
  selectChain
} from '../features/chain/chainSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import { stashDisplay, nameDisplay } from '../util/display'
import { chainAddress } from '../util/crypto';
import { getNetworkSS58Format } from '../constants';

function createPieData(e, i, m, a, u, n) {
  return { e, i, m, a, u, n };
}

export default function ValGroupPieCharts({sessionIndex, groupId}) {
  const selectedAddress = useSelector(selectAddress);
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let filtered = validators.filter(v => v.address !== selectedAddress)
  filtered.splice(0,0,validators.find(v => v.address === selectedAddress));

  const data = filtered.map(v => createPieData(
    v.para_summary.ev, 
    v.para_summary.iv, 
    v.para_summary.mv,
    v.para?.bitfields.ba,
    v.para?.bitfields.bu,
    nameDisplay(v.profile?.identity ? v.profile._identity : stashDisplay(chainAddress(v.address, getNetworkSS58Format(selectedChain)), 4), 24, selectedAddress === v.address ? '★ ' : ''))
  )

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
          <Typography variant="h6">Attestations and Bitfields Availability</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around'}}>
        {data.map((o, i) => (<L2PieChart key={i} data={o} showIdentity />))}
      </Box>
    </Paper>
  );
}