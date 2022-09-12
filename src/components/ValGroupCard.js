import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import BackingPieChart from './BackingPieChart';
import ValGroupList from './ValGroupList';
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice';
import { isChainSupported, getChainName } from '../constants'
import { calculateMvr } from '../util/mvr'

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ValGroupCard({sessionIndex, groupId}) {
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex, groupId));
  
  const paraId = validators[0].para.pid;
  const coreAssignments = validators[0].para_summary.ca;

  // calculate MVR
  const e = validators.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0);
  const i = validators.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0);
  const m = validators.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0);
  const mvr = calculateMvr(e, i, m);
  const validityVotes = validators.length > 0 ? ((e + i + m) / validators.length) : 0;
  const pieChartsData = createBackingPieData(e, i, m, paraId);
  const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? getChainName(selectedChain, paraId) : paraId) : '';

  return (
    <Paper sx={{ 
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 376,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2, height: 302}}>
        <Box>
          <Typography variant="h6">Val. Group {groupId}</Typography>
          <Typography variant="caption"><i>{!!chainName ? `Currently backing ${chainName}` : 'Not backing'}</i></Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <ValGroupList sessionIndex={sessionIndex} groupId={groupId} />
          <BackingPieChart data={pieChartsData} size="md" />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Core Assignments</Typography>
          <Typography variant="h5" align='center'>{coreAssignments}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Validity Votes</Typography>
          <Typography variant="h5" align='center'>{validityVotes}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Missed Vote Ratio</Typography>
          <Typography variant="h5" align='center'>{!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}