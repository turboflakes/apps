import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex, groupId));
  
  const paraId = validators[0].para.pid;
  const coreAssignments = validators[0].para_summary.ca;

  const filtered = validators.filter(v => v.is_auth && v.is_para);
  console.log("___validators", validators);
  
  // calculate MVR
  const e = filtered.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0);
  const i = filtered.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0);
  const m = filtered.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0);
  const mvr = calculateMvr(e, i, m);
  // calculate backing points
  const backingPoints = filtered.map(v => (v.auth.ep - v.auth.sp) > 0 ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0).reduce((a, b) => a + b, 0);
  const validityVotes = filtered.length > 0 ? ((e + i + m) / filtered.length) : 0;
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
      height: 408,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ height: '72px', p: 2 }}>
        <Box sx={{ mb:1 }}>
          <Typography variant="h6">Val. Group {groupId}</Typography>
          <Typography variant="subtitle2">{!!chainName ? `Currently backing ${chainName}` : 'Not backing'}</Typography>
        </Box>
      </Box>
      <Divider sx={{ 
        opacity: 0.25,
        height: '1px',
        borderTop: '0px solid rgba(0, 0, 0, 0.08)',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
        }} />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ValGroupList sessionIndex={sessionIndex} groupId={groupId} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Typography variant="caption" align='center'>Validity Statements</Typography>  
            <Typography variant="h5" align='center'>{validityVotes}</Typography>
          </Box>
          <BackingPieChart data={pieChartsData} size="md" />
        </Box>
      </Box>
      <Divider sx={{ 
        opacity: 0.25,
        height: '1px',
        borderTop: '0px solid rgba(0, 0, 0, 0.08)',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
        }} />
      <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Core Assignments</Typography>
          <Typography variant="h5" align='center'>{coreAssignments}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Missed Vote Ratio</Typography>
          <Typography variant="h5" align='center'>{!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Backing Points</Typography>
          <Typography variant="h5" align='center'>{backingPoints}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}