import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import LevelsPieChart from './LevelsPieChart';
import ValGroupList from './ValGroupList';
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  selectValGroupParaIdBySessionAndGroupId,
  selectValGroupMvrBySessionAndGroupId,
  selectValGroupBarBySessionAndGroupId,
  selectValGroupAvailabilityBySessionAndGroupId,
  selectValGroupUnavailabilityBySessionAndGroupId,
  selectValGroupVersionsBySessionAndGroupId,
  selectValGroupValidityVotesBySessionAndGroupId,
  selectValGroupValidityExplicitVotesBySessionAndGroupId,
  selectValGroupValidityImplicitVotesBySessionAndGroupId,
  selectValGroupValidityMissedVotesBySessionAndGroupId,
  selectValGroupBackingPointsBySessionAndGroupId,
  selectValGroupGradesBySessionAndGroupId,
  // selectValGroupCoreAssignmentsBySessionAndGroupId
} from '../features/api/valGroupsSlice';
import { isChainSupported, getChainName } from '../constants'
import { versionToNumber } from '../util/display'

function createPieDataA(a, u) {
  return { a, u };
}

function createPieDataB(e, i, m) {
  return { e, i, m };
}

export default function ValGroupCard({sessionIndex, groupId}) {
  // const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const paraId = useSelector(state => selectValGroupParaIdBySessionAndGroupId(state, sessionIndex, groupId));
  const mvr = useSelector(state => selectValGroupMvrBySessionAndGroupId(state, sessionIndex, groupId));
  const ev = useSelector(state => selectValGroupValidityExplicitVotesBySessionAndGroupId(state, sessionIndex, groupId));
  const iv = useSelector(state => selectValGroupValidityImplicitVotesBySessionAndGroupId(state, sessionIndex, groupId));
  const mv = useSelector(state => selectValGroupValidityMissedVotesBySessionAndGroupId(state, sessionIndex, groupId));
  const backingPoints = useSelector(state => selectValGroupBackingPointsBySessionAndGroupId(state, sessionIndex, groupId));
  const validityVotes = useSelector(state => selectValGroupValidityVotesBySessionAndGroupId(state, sessionIndex, groupId));
  // const coreAssignments = useSelector(state => selectValGroupCoreAssignmentsBySessionAndGroupId(state, sessionIndex, groupId));
  const bar = useSelector(state => selectValGroupBarBySessionAndGroupId(state, sessionIndex, groupId));
  const ba = useSelector(state => selectValGroupAvailabilityBySessionAndGroupId(state, sessionIndex, groupId));
  const bu = useSelector(state => selectValGroupUnavailabilityBySessionAndGroupId(state, sessionIndex, groupId));
  const versions = useSelector(state => selectValGroupVersionsBySessionAndGroupId(state, sessionIndex, groupId));
  const grades = useSelector(state => selectValGroupGradesBySessionAndGroupId(state, sessionIndex, groupId));
  
  // backing votes
  const dataL4 = createPieDataB(ev, iv, mv);
  // bitfields availability
  const dataL3 = createPieDataA(ba, bu);
  // versions
  const groupedByVersion = groupBy(versions, v => v);
  const dataL2 = Object.keys(groupedByVersion).reduce((acc, key) => {
    acc[key] = groupedByVersion[key].length;
    return acc;
  }, {});
  // grades
  const groupedByGrade = groupBy(grades, v => v);
  const dataL1 = Object.keys(groupedByGrade).reduce((acc, key) => {
    acc[key] = groupedByGrade[key].length;
    return acc;
  }, {});
  
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
      <Box sx={{ p: 2, display: 'inline-flex', justifyContent: 'space-around', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <ValGroupList sessionIndex={sessionIndex} groupId={groupId} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
            <Typography variant="caption" align='center'>Validity Statements</Typography>  
            <Typography variant="h5" align='center'>{validityVotes.format()}</Typography>
          </Box>
          <LevelsPieChart dataL1={dataL1} dataL2={dataL2} dataL3={dataL3} dataL4={dataL4} size="md" />
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
        {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Core Assignments</Typography>
          <Typography variant="h5" align='center'>{coreAssignments}</Typography>
        </Box> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>BAR</Typography>
          <Typography variant="h5" align='center'>{!isUndefined(bar) ? Math.round(bar * 10000) / 10000 : '-'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>MVR</Typography>
          <Typography variant="h5" align='center'>{!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="caption" align='center'>Backing Points (x̅)</Typography>
          <Typography variant="h5" align='center'>{backingPoints.format()}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}