import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import orderBy from 'lodash/orderBy'
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
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
import { grade } from '../util/grade';

function createDataGridRows(id, identity, address, b, i, e, m, p) {
  return { id, identity, address, b, i, e, m, p };
}

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ValGroupCard({validators, groupId}) {
  const theme = useTheme();
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
      return createDataGridRows(i+1, v.identity, v.address, authored_blocks, implicit_votes, explicit_votes, missed_votes, total_points)
    } else {
      return createDataGridRows(i+1, '-', '', 0, 0, 0, 0, 0)
    }
  })

  const pieChartsData = dataGridRows.map(o => createBackingPieData(o.e, o.i, o.m, o.n)).reduce((prev, current) => 
    createBackingPieData(prev.e + current.e, prev.i + current.i, prev.m + current.m, prev.n), 
    createBackingPieData(0,0,0, groupId));

  const principal = validators[0];
  const stats = Object.values(principal.para.para_stats);
  const coreAssignments = stats.map(o => o.core_assignments).reduce((prev, current) => prev + current, 0)
  const chainName = principal.para.para_id ? (isChainSupported(selectedChain, principal.para.para_id) ? getChainName(selectedChain, principal.para.para_id) : principal.para.para_id) : ''
  const validityVotes = dataGridRows[0].e + dataGridRows[0].i + dataGridRows[0].m
  const mvr = calculateMvr(
    dataGridRows.map(o => o.e).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.i).reduce((prev, current) => prev + current, 0),
    dataGridRows.map(o => o.m).reduce((prev, current) => prev + current, 0)
  )
  const validatorsOrderedByPoints = orderBy(dataGridRows, o => o.p, "desc")

  const handleAddressSelected = (address) => {
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
                <ListItemButton key={i} sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(v.address)}>
                  <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
                    <span style={{ width: '4px', height: '4px', marginLeft: '-4px', marginRight: '8px', borderRadius: '50%', backgroundColor: theme.palette.grade[grade(1-calculateMvr(v.e, v.i, v.m))], display: "inline-block" }}></span>
                    <Identicon
                      value={v.address}
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
          <Typography variant="caption" align='center'>Validity Votes</Typography>
          <Typography variant="h5" align='center'>{validityVotes}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pb: 1}}>
          <Typography variant="caption" align='center'>Missed Vote Ratio</Typography>
          <Typography variant="h5" align='center'>{!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}