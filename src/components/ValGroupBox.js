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
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
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
  const {data, isSuccess, isError, error} = useGetValidatorByAddressQuery(address, {refetchOnMountOrArgChange: true});
  const selectedChain = useSelector(selectChain);
  const allValidators = useSelector(selectValidatorsAll)

  if (isError) {
    return (<Typography>! {error.data.errors[0]}</Typography>)
  }
  
  if (!isSuccess) {
    return null
  }

  // Filter validator by addresse and session
  const principal = allValidators.find(o => data.address === o.address && o.session === sessionIndex)
  
  if (isUndefined(principal)) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not found.</Typography>)
  }

  if (!principal.is_auth) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Authority.</Typography>)
  }

  if (!principal.is_para) {
    return (<Typography>At the current session the validator {stashDisplay(address)} is not Para Validator.</Typography>)
  }

  // Group is the selected validator and peers
  const group = [
    principal,
    ...allValidators.filter(o => principal.para.peers.includes(o.auth.index))
  ];
  
  const dataGridRows = group.map((v, i) => {
    if (v.is_auth) {
      const authored_blocks = v.auth.authored_blocks
      const total_points = v.auth.end_points - v.auth.start_points
      const stats = Object.values(v.para.para_stats)
      const explicit_votes = stats.map(o => o.explicit_votes).reduce((prev, current) => prev + current, 0)
      const implicit_votes = stats.map(o => o.implicit_votes).reduce((prev, current) => prev + current, 0)
      const missed_votes = stats.map(o => o.missed_votes).reduce((prev, current) => prev + current, 0)
      return createDataGridRows(i+1, v.identity, v.address, authored_blocks, implicit_votes, explicit_votes, missed_votes, total_points)
    } else {
      return createDataGridRows(i+1, '-', '', 0, 0, 0, 0, 0)
    }
  })

  const stats = Object.values(principal.para.para_stats);
  const coreAssignments = stats.map(o => o.core_assignments).reduce((prev, current) => prev + current, 0)
  const validityVotes = dataGridRows[0].e + dataGridRows[0].i + dataGridRows[0].m
  const mvr = calculateMvr(
    dataGridRows.map(o => o.e).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.i).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.m).reduce((prev, current) => prev + current, 0)
  )

  const chainName = principal.para.para_id ? (isChainSupported(selectedChain, principal.para.para_id) ? getChainName(selectedChain, principal.para.para_id) : principal.para.para_id) : ''

  const pieChartsData = dataGridRows.map(o => createBackingPieData(o.e, o.i, o.m, o.identity))

  const barChartsData = dataGridRows.map(o => {
    return {
      p: o.p,
      n: nameDisplay(o.identity, 15)
    }
  })

  const parachainIds = Object.keys(principal.para.para_stats);
  const parachainsData = parachainIds.map((p, i) => {
    return group.map((v, j) => {
      if (v.para.para_stats[p]) {
        const total = v.para.para_stats[p].explicit_votes + v.para.para_stats[p].implicit_votes + v.para.para_stats[p].missed_votes
        return createParachainsData(j+1, 1, v.para.para_stats[p].explicit_votes + v.para.para_stats[p].implicit_votes, v.para.para_stats[p].missed_votes, v.para.para_stats[p].points, total)
      }
      return createParachainsData(j+1, 1, 0, 0, 0, 0)
    })
  })

  const valIdentities = group.map((v, i) => ({
    code: codes[i],
    identity: v.identity
  }))

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
            <Typography variant="h5" paragraph>Val. Group {data.para.group}</Typography>
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
                    <img src={getChainLogo(selectedChain, principal.para.para_id)} style={{ width: 32, height: 32, marginRight: 8, marginBottom: 4, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
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
                    <ValGroupPieCharts data={pieChartsData} groupId={data.para.group}/>
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupPointsChart data={barChartsData} groupId={data.para.group} />
                  </Grid>
                  <Grid item xs={12}>
                    <ValGroupDataGrid rows={dataGridRows} groupId={data.para.group} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <ValGroupParachainsChart data={parachainsData} ids={parachainIds} identities={valIdentities} groupId={data.para.group} />
              </Grid>
            </Grid>            
          </Grid>
        </Grid>
    </Box>
  );
}