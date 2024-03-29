import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupPieCharts from './ValGroupPieCharts';
import ValGroupDataGrid from './ValGroupDataGrid';
import ValGroupPointsChart from './ValGroupPointsChart';
import ValGroupParachainsChart from './ValGroupParachainsChart';
import ValGroupCoreAssignmentBox from './ValGroupCoreAssignmentBox';
import ValGroupValidityVotesBox from './ValGroupValidityVotesBox';
import ValGroupMvrBox from './ValGroupMvrBox';
import ValGroupBackingPointsBox from './ValGroupBackingPointsBox';
import { 
  selectValidatorBySessionAndAddress
} from '../features/api/validatorsSlice'
 import {
   selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import {
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectIsLiveMode,
  selectIsHistoryMode
} from '../features/layout/layoutSlice';
import {
  selectSessionByIndex,
} from '../features/api/sessionsSlice';
// import { stashDisplay } from '../util/display'
import { isChainSupported, getChainName, getChainLogo } from '../constants'


export default function ValGroupBox({address, sessionIndex}) {
  const theme = useTheme();
  const primary = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address));
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistorMode = useSelector(selectIsHistoryMode);
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex));
  const groupId = !isUndefined(primary) ? (primary.is_para ? primary.para.group : undefined) : undefined;
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));

  if (isUndefined(primary)) {
    return null
  }

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  // Make the selectedAddress the first in the list
  let filtered = validators.filter(v => v.address !== selectedAddress)
  filtered.splice(0,0, validators.find(v => v.address === selectedAddress));

  const paraId = primary.para.pid;
  const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? 
    getChainName(selectedChain, paraId) : paraId) : '';

  return (
    <Box
      sx={{
        // p: 2,
        m: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // height: 600,
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" >Val. Group {groupId}</Typography>
          <Typography variant="subtitle" sx={{ color: theme.palette.neutrals[300] }}>At session {sessionIndex.format()}</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <ValGroupCoreAssignmentBox sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
          <Grid item xs={2}>
            <ValGroupValidityVotesBox sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
          <Grid item xs={2}>
            <ValGroupMvrBox sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
          <Grid item xs={2}>
            <ValGroupBackingPointsBox sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
          <Grid item xs={4}>
            {isLiveMode ? 
              <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%',
                  height: 96,
                  borderRadius: 3,
                  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
                }}>
                <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Box sx={{ display: 'flex' }} >
                    <Box>
                      <img src={getChainLogo(selectedChain, paraId)} style={{ width: 32, height: 32, marginRight: 8, marginBottom: 4, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
                    </Box>
                    <Typography variant="h5" gutterBottom>{chainName}</Typography>
                  </Box>
                  <Typography variant="caption">{!!chainName ? 'Backing Parachain' : 'Not Backing'}</Typography>
                </Box>
              </Paper> : null}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ValGroupPieCharts sessionIndex={sessionIndex} groupId={groupId} />
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupPointsChart sessionIndex={sessionIndex} groupId={groupId} />
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupDataGrid sessionIndex={sessionIndex} groupId={groupId} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <ValGroupParachainsChart sessionIndex={sessionIndex} groupId={groupId} />
              </Grid>
            </Grid>            
          </Grid>
        </Grid>
    </Box>
  );
}