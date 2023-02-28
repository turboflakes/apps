import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import SubsetPieChart from './SubsetPieChart';
import PoolNomineesCardList from './PoolNomineesCardList';
import {
  selectChain,
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  selectPoolById,
} from '../features/api/poolsMetadataSlice';
import {
  selectNomineesBySessionAndPoolId
} from '../features/api/poolsSlice';
import { stakeDisplay } from '../util/display';

export default function PoolCard({sessionIndex, poolId}) {
  // const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const selectedChainInfo = useSelector(selectChainInfo);
  const pool = useSelector(state => selectPoolById(state, poolId));
  const members = !isUndefined(pool.stats) ? pool.stats.member_counter : 0;
  const points = !isUndefined(pool.stats) ? pool.stats.points : 0;
  const apr = !isUndefined(pool.nomstats) ? pool.nomstats.apr : 0;
  const nominees = useSelector(state => selectNomineesBySessionAndPoolId(state, sessionIndex, poolId));
  

  
  // const mvr = useSelector(state => selectValGroupMvrBySessionAndGroupId(state, sessionIndex, groupId));
  // const ev = useSelector(state => selectValGroupValidityExplicitVotesBySessionAndGroupId(state, sessionIndex, groupId));
  // const iv = useSelector(state => selectValGroupValidityImplicitVotesBySessionAndGroupId(state, sessionIndex, groupId));
  // const mv = useSelector(state => selectValGroupValidityMissedVotesBySessionAndGroupId(state, sessionIndex, groupId));
  // const validityVotes = useSelector(state => selectValGroupValidityVotesBySessionAndGroupId(state, sessionIndex, groupId));
  // const backingPoints = useSelector(state => selectValGroupBackingPointsBySessionAndGroupId(state, sessionIndex, groupId));
  // const coreAssignments = useSelector(state => selectValGroupCoreAssignmentsBySessionAndGroupId(state, sessionIndex, groupId));

  // const pieChartsData = createBackingPieData(ev, iv, mv, paraId);
  // const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? getChainName(selectedChain, paraId) : paraId) : '';

  // const subsetPieData = 
  if (isUndefined(selectedChainInfo)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 408,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

  const groupedBySubset = groupBy(nominees, v => !isUndefined(v.profile) ? v.profile.subset : "NA");
  const subsetPieData = orderBy(Object.keys(groupedBySubset).map(subset => ({ subset, value: groupedBySubset[subset].length })), 'subset');
  
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
          <Typography variant="h6" sx={{
            overflow: "hidden", 
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>{pool.metadata}</Typography>
          <Typography variant="subtitle2">#{poolId}</Typography>
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
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-around'}}>
        <PoolNomineesCardList sessionIndex={sessionIndex} poolId={poolId} />
      
        <Box sx={{ display: 'flex', justifyContent: 'center', width: "50%"}}>
          {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Typography variant="caption" align='center'>Validity Statements</Typography>  
            <Typography variant="h5" align='center'>{validityVotes}</Typography>
          </Box> */}
          <SubsetPieChart data={subsetPieData} size="md" />
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
          <Typography variant="caption" align='center'>Members</Typography>
          <Typography variant="h5" align='center'>{members}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Points</Typography>
          <Typography variant="h5" align='center'>{stakeDisplay(points, selectedChainInfo, 2, true, false)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>APR</Typography>
          <Typography variant="h5" align='center'>{`${Math.round(apr * 10000) / 100}%`}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}