import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import orderBy from 'lodash/orderBy'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import BackingPieChart from './BackingPieChart';
import {
  selectChain,
  addressChanged
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import { isChainSupported, getChainName, getChainLogo } from '../constants'
import { calculateMvr } from '../util/mvr'
import {nameDisplay} from '../util/display'

function createDataGridRows(id, n, b, i, e, m, p) {
  return { id, n, b, i, e, m, p };
}

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ValGroupCard({validators, groupId}) {
  const dispatch = useDispatch();
  const history = useHistory()
  const selectedChain = useSelector(selectChain);
  // const total = data.e + data.i + data.m;
   
  const dataGridRows = validators.map((v, i) => {
    if (v.is_auth) {
      const authored_blocks = v.auth.authored_blocks
      const total_points = v.auth.end_points
      const stats = Object.values(v.para.para_stats)
      const explicit_votes = stats.map(o => o.explicit_votes).reduce((prev, current) => prev + current, 0)
      const implicit_votes = stats.map(o => o.implicit_votes).reduce((prev, current) => prev + current, 0)
      const missed_votes = stats.map(o => o.missed_votes).reduce((prev, current) => prev + current, 0)
      return createDataGridRows(i+1, v.identity, authored_blocks, implicit_votes, explicit_votes, missed_votes, total_points)
    } else {
      return createDataGridRows(i+1, '-', 0, 0, 0, 0, 0)
    }
  })

  const pieChartsData = dataGridRows.map(o => createBackingPieData(o.e, o.i, o.m, o.n)).reduce((prev, current) => 
    createBackingPieData(prev.e + current.e, prev.i + current.i, prev.m + current.m, prev.n), 
    createBackingPieData(0,0,0, groupId));

  const principal = validators[0];
  const stats = Object.values(principal.para.para_stats);
  const coreAssignments = stats.map(o => o.core_assignments).reduce((prev, current) => prev + current, 0)
  const backingStatements = stats.map(o => o.explicit_votes + o.implicit_votes + o.missed_votes).reduce((prev, current) => prev + current, 0)
  const mvr = Math.round(calculateMvr(
    dataGridRows.map(o => o.e).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.i).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.m).reduce((prev, current) => prev + current, 0)
  ) * 10000) / 10000

  
  const chainName = principal.para.para_id ? (isChainSupported(selectedChain, principal.para.para_id) ? getChainName(selectedChain, principal.para.para_id) : principal.para.para_id) : ''

  const validatorsOrderedByPoints = orderBy(validators, (o) => (o.auth.end_points - o.auth.start_points), "desc")

  const handleAddressSelected = (address) => {
    console.log("__", address);
    dispatch(addressChanged(address));
    const page = 'val-performance'
    dispatch(pageChanged(page));
    history.push(`/${selectedChain}/${page}`)
  }


  return (
    <Paper sx={{ 
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 348,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2}}>
        <Box sx={{ mb:1, height: 40,  display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Val. Group {groupId}</Typography>
          </Box>
          {!!chainName ?
          <Box sx={{ p: `4px 8px`, display: 'flex', alignItems: 'center', borderRadius: 30, backgroundColor: '#EEEEEE' }} >
            <img src={getChainLogo(selectedChain, principal.para.para_id)} style={{ width: 32, height: 32, marginRight: 8, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
            <Typography variant="h6">{chainName}</Typography>
          </Box> : null}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <List dense >
              {validatorsOrderedByPoints.map((v, i) => (
                <ListItemButton key={i} sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(v.auth.address)}>
                  <ListItemIcon sx={{minWidth: 0, mr: 1}}>
                    <Identicon
                      value={v.auth.address}
                      size={24}
                      theme={'polkadot'} />
                  </ListItemIcon>
                  <ListItemText sx={{whiteSpace: "nowrap"}}
                    primary={nameDisplay(v.identity, 15)}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <BackingPieChart data={pieChartsData} size="md" />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2, height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Core Assignments</Typography>
          <Typography variant="h5" align='center'>{coreAssignments}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Statements (Votes)</Typography>
          <Typography variant="h5" align='center'>{backingStatements}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>MVR</Typography>
          <Typography variant="h5" align='center'>{mvr}</Typography>
        </Box>
          {/* <Box sx={{ display: 'flex' }} >
            <Box>
              <img src={getChainLogo(selectedChain, principal.para.para_id)} style={{ width: 32, height: 32, marginRight: 8, marginBottom: 4, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
            </Box>
            <Typography variant="h5" gutterBottom>{chainName}</Typography>
          </Box>
          <Typography variant="caption">{!!chainName ? 'Backing Parachain' : 'Not Backing'}</Typography> */}
      </Box>
    </Paper>
  );
}