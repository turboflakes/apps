import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
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
  selectParachainBySessionAndParaId,
  selectParachainMvrBySessionAndParaId,
  selectParachainBackingPointsBySessionAndParaId
 } from '../features/api/parachainsSlice'
import { isChainSupported, getChainName, getChainLogo } from '../constants'

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ParachainCard({sessionIndex, paraId}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const parachain = useSelector(state => selectParachainBySessionAndParaId(state, sessionIndex, paraId));
  const mvr = useSelector(state => selectParachainMvrBySessionAndParaId(state, sessionIndex, paraId));
  const backingPoints = useSelector(state => selectParachainBackingPointsBySessionAndParaId(state, sessionIndex, paraId));
  
  if (!parachain) {
    return null
  }

  // NOTE: parachain cOre_assignments is given in cents (100 = 1)
  const coreAssignments = parseInt(parachain.stats.ca / 100);
  const validityVotes = parachain.stats.ev + parachain.stats.iv + parachain.stats.mv;
  const pieChartsData = createBackingPieData(parachain.stats.ev, parachain.stats.iv, parachain.stats.mv, paraId);
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
      <Box sx={{height: '72px', p: 2}}>
        <Box sx={{ mb:1, display: 'flex', justifyContent: 'space-between' }}>
          {!!chainName ?
          <Box sx={{ p: `4px 8px`, display: 'flex', alignItems: 'center', borderRadius: 3, bgcolor: theme.palette.grey[0] }} >
            <img src={getChainLogo(selectedChain, paraId)} style={{ width: 32, height: 32, marginRight: 8, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
            <Typography variant="h6" sx={{m:0}}>
              {chainName}
            </Typography>
          </Box> : null}
          <Typography variant="caption"><b>{paraId.format()}</b></Typography>
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

      <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-around'}}>
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Typography variant="caption" align='center'>Validity Statements</Typography>  
            <Typography variant="h5" align='center'>{validityVotes.format()}</Typography>
          </Box>
          <BackingPieChart data={pieChartsData} size="md" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Typography variant="caption" sx={{ ml: 3 }}>{!isNull(parachain.group) ? `Backed by Val. Group ${parachain.group}` : `Waiting core assignment`}</Typography>
          <ValGroupList sessionIndex={sessionIndex} groupId={parachain.group} />
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
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
          <Typography variant="caption" align="right">Backing Points</Typography>
          <Typography variant="h5" align="right">{backingPoints.format()}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}