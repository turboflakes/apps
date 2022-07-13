import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupPieCharts from './ValGroupPieCharts';
import ValGroupDataGrid from './ValGroupDataGrid';
import ValGroupPointsChart from './ValGroupPointsChart';
import ValGroupParachainsChart from './ValGroupParachainsChart';
import { 
  useGetValidatorByStashQuery,
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
import {
  selectChain
} from '../features/chain/chainSlice';
import { stashDisplay } from '../util/display'
import { isChainSupported, getChainName, getChainLogo } from '../constants'

const codes = ['★', 'A', 'B', 'C', 'D']

function createData(id, n, b, i, e, m, p) {
  return { id, n, b, i, e, m, p };
}

function createParachainsData(x, y, a, m, p, z) {
  return { x, y, a, m, p, z };
}

const calculate_mvr = (e, i, m) => {
  const total = e + i + m;
  if (total === 0) {
    return undefined
  } 
  return m / total
}

export default function ValGroupDataBox({stash}) {
  
  const {data, isSuccess} = useGetValidatorByStashQuery(stash, {refetchOnMountOrArgChange: true});
  const selectedChain = useSelector(selectChain);
  const allValidators = useSelector(selectValidatorsAll)
  
  if (!isSuccess) {
    return null
  }

  if (!data.is_auth) {
    return (<Typography>stashDisplay(stash) is not Authority for the current Era.</Typography>)
  }

  const principal = allValidators.find(o => data.auth.address === o.auth.address)

  if (!principal.is_para) {
    return (<Typography>{stashDisplay(stash)} is not Para Validator for the current Session</Typography>)
  }

  // Group is the selected validator and peers
  const group = [
    principal,
    ...allValidators.filter(o => principal.para.peers.includes(o.auth.index))
  ];
  
  const dataGridRows = group.map((v, i) => {
    if (v.is_auth) {
      const authored_blocks = v.auth.authored_blocks
      const total_points = v.auth.end_points
      const stats = Object.values(v.para.para_stats)
      const explicit_votes = stats.map(o => o.explicit_votes).reduce((prev, current) => prev + current, 0)
      const implicit_votes = stats.map(o => o.implicit_votes).reduce((prev, current) => prev + current, 0)
      const missed_votes = stats.map(o => o.missed_votes).reduce((prev, current) => prev + current, 0)
      return createData(i+1, v.identity, authored_blocks, implicit_votes, explicit_votes, missed_votes, total_points)
    } else {
      return createData(i+1, '-', 0, 0, 0, 0, 0)
    }
  })

  const stats = Object.values(principal.para.para_stats);
  const coreAssignments = stats.map(o => o.core_assignments).reduce((prev, current) => prev + current, 0)
  const backingStatements = stats.map(o => o.explicit_votes + o.implicit_votes + o.missed_votes).reduce((prev, current) => prev + current, 0)
  const mvr = Math.round(calculate_mvr(
    dataGridRows.map(o => o.e).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.i).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.m).reduce((prev, current) => prev + current, 0)
  ) * 10000) / 10000

  const chainName = principal.para.para_id ? (isChainSupported(selectedChain, principal.para.para_id) ? getChainName(selectedChain, principal.para.para_id) : principal.para.para_id) : ''

  const pieChartsData = dataGridRows.map(o => {
    return {
      e: o.e,
      i: o.i,
      m: o.m,
      n: o.n
    }
  })

  const barChartsData = dataGridRows.map(o => {
    return {
      p: o.p,
      n: o.n
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
                <Typography variant="caption">Total Core Assignments</Typography>
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
                <Typography variant="h4" gutterBottom>{backingStatements}</Typography>
                <Typography variant="caption">Total Statements</Typography>
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
                <Typography variant="h4" gutterBottom>{mvr}</Typography>
                <Typography variant="caption">Val. Group Missed Vote Ratio</Typography>
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