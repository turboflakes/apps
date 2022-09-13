import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupPieCharts from './ValGroupPieCharts';
import ValGroupDataGrid from './ValGroupDataGrid';
import ValGroupPointsChart from './ValGroupPointsChart';
import ValGroupParachainsChart from './ValGroupParachainsChart';
import { 
  useGetValidatorByAddressQuery,
} from '../features/api/validatorsSlice'
 import {
   selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import {
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import { stashDisplay } from '../util/display'
import { isChainSupported, getChainName, getChainLogo } from '../constants'
import { calculateMvr } from '../util/mvr'


export default function ValGroupBox({address, sessionIndex}) {
  const {data, isSuccess, isError, error} = useGetValidatorByAddressQuery({address, session: sessionIndex, show_summary: true, show_stats: true}, {refetchOnMountOrArgChange: true});
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const groupId = !!data ? (!!data.is_para ? data.para.group : undefined) : undefined;
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));
  
  if (isError) {
    return (<Typography>! {error}</Typography>)
  }
  
  if (!isSuccess) {
    return null
  }

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let filtered = validators.filter(v => v.address !== selectedAddress)
  filtered.splice(0,0,validators.find(v => v.address === selectedAddress));

  if (isUndefined(filtered[0])) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not found.</Typography>)
  }

  if (!filtered[0].is_auth) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Authority.</Typography>)
  }

  if (!filtered[0].is_para) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Para Validator.</Typography>)
  }

  const paraId = filtered[0].para.pid;
  const coreAssignments = filtered[0].para_summary.ca;
  const validityVotes = filtered[0].para_summary.ev + filtered[0].para_summary.iv + filtered[0].para_summary.mv;
  const mvr = calculateMvr(
    validators.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0),
    validators.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0),
    validators.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0)
  )

  const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? getChainName(selectedChain, paraId) : paraId) : '';


  return (
    <Box
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // height: 600,
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" paragraph>Val. Group {groupId}</Typography>
            {/* <Typography variant="subtitle2">-</Typography> */}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: 112,
                borderRadius: 3,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
              }}>
              <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h4" gutterBottom>{coreAssignments}</Typography>
                <Typography variant="caption">Core Assignments</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: 112,
                borderRadius: 3,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
              }}>
              <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h4" gutterBottom>{validityVotes}</Typography>
                <Typography variant="caption">Validity Votes</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: 112,
                borderRadius: 3,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
              }}>
              <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography variant="h4" gutterBottom>{!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}</Typography>
                <Typography variant="caption">Missed Vote Ratio</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: 112,
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
            </Paper>
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