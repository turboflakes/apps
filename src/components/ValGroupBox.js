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
  selectValidatorBySessionAndAddress,
  selectValidatorsAll
} from '../features/api/validatorsSlice'
 import {
   selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import {
  selectChain
} from '../features/chain/chainSlice';
import { stashDisplay, nameDisplay } from '../util/display'
import { isChainSupported, getChainName, getChainLogo } from '../constants'
import { calculateMvr } from '../util/mvr'

const codes = ['★', 'A', 'B', 'C', 'D']

function createDataGridRows(id, identity, address, b, i, e, m, p) {
  return { id, identity, address, b, i, e, m, p };
}

function createParachainsData(x, y, a, m, p, z) {
  return { x, y, a, m, p, z };
}

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ValGroupBox({address, sessionIndex}) {
  const {data, isSuccess, isError, error} = useGetValidatorByAddressQuery({address, session: sessionIndex, show_summary: true, show_stats: true}, {refetchOnMountOrArgChange: true});
  const selectedChain = useSelector(selectChain);
  const groupId = !!data ? (!!data.is_para ? data.para.group : undefined) : undefined;
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));
  
  if (isError) {
    return (<Typography>! {error}</Typography>)
  }
  
  if (!isSuccess) {
    return null
  }

  const principal = validators.filter(v => v.address === address)[0];

  if (isUndefined(principal)) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not found.</Typography>)
  }

  if (!principal.is_auth) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Authority.</Typography>)
  }

  if (!principal.is_para) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Para Validator.</Typography>)
  }
  
  const dataGridRows = validators.map((v, i) => {
    if (v.is_auth && v.is_para) {
      const authored_blocks = v.auth.ab;
      const total_points = v.auth.ep - v.auth.sp;
      return createDataGridRows(i+1, nameDisplay(!!v.identity ? v.identity : stashDisplay(v.address, 4), 12), v.address, authored_blocks, v.para_summary.iv, v.para_summary.ev, v.para_summary.mv, total_points)
    } else {
      return createDataGridRows(i+1, '-', '', 0, 0, 0, 0, 0)
    }
  })

  // const groupId = validator.para.group;
  const paraId = principal.para.pid;
  const coreAssignments = principal.para_summary.ca;
  const validityVotes = principal.para_summary.ev + principal.para_summary.iv + principal.para_summary.mv;
  const mvr = calculateMvr(
    dataGridRows.map(o => o.e).reduce((a, b) => a + b, 0),
    dataGridRows.map(o => o.i).reduce((a, b) => a + b, 0),
    dataGridRows.map(o => o.m).reduce((a, b) => a + b, 0)
  )

  const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? getChainName(selectedChain, paraId) : paraId) : '';

  const pieChartsData = dataGridRows.map(v => createBackingPieData(v.e, v.i, v.m, v.identity))

  const barChartsData = dataGridRows.map(v => {
    return {
      p: v.p,
      n: v.identity
    }
  })

  // const parachainIds = Object.keys(principal.para.stats);
  // const parachainsData = parachainIds.map((p, i) => {
  //   return group.map((v, j) => {
  //     if (v.para.stats[p]) {
  //       const total = v.para.stats[p].ev + v.para.stats[p].iv + v.para.stats[p].mv
  //       return createParachainsData(j+1, 1, v.para.stats[p].ev + v.para.stats[p].iv, v.para.stats[p].mv, v.para.stats[p].pt, total)
  //     }
  //     return createParachainsData(j+1, 1, 0, 0, 0, 0)
  //   })
  // })

  // const valIdentities = group.map((v, i) => ({
  //   code: codes[i],
  //   identity: v.identity
  // }))

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
                    <ValGroupPieCharts data={pieChartsData} groupId={groupId}/>
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupPointsChart data={barChartsData} groupId={groupId} />
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupDataGrid rows={dataGridRows} groupId={groupId} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                {/* <ValGroupParachainsChart data={parachainsData} ids={parachainIds} identities={valIdentities} groupId={validator.para.group} /> */}
              </Grid>
            </Grid>            
          </Grid>
        </Grid>
    </Box>
  );
}