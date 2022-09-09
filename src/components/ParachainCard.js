import * as React from 'react';
import { useNavigate } from 'react-router-dom'
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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
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
import { stashDisplay, nameDisplay } from '../util/display'
import { grade } from '../util/grade';

function createBackingPieData(e, i, m, n) {
  return { e, i, m, n };
}

export default function ParachainCard({validators}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const selectedChain = useSelector(selectChain);
  
  const groupId = validators[0].para.group;
  const paraId = validators[0].para.pid;
  const coreAssignments = validators[0].para_summary.ca;

  // calculate MVR
  const e = validators.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0);
  const i = validators.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0);
  const m = validators.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0);
  const mvr = calculateMvr(e, i, m);
  const validityVotes = validators.length > 0 ? ((e + i + m) / validators.length) : 0;
  const pieChartsData = createBackingPieData(e, i, m, paraId);
  const validatorsOrderedByPoints = orderBy(validators, o => o.auth.ep - o.auth.sp, "desc");  
  const chainName = paraId ? (isChainSupported(selectedChain, paraId) ? getChainName(selectedChain, paraId) : paraId) : '';

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged('parachains/val-group'));
    const path = `/one-t/${selectedChain}/parachains/val-group`
    navigate(`${path}?address=${address}`)
  }

  return (
    <Paper sx={{ 
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 376,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2, height: 302}}>
        <Box sx={{ mb:1, height: 40,  display: 'flex', justifyContent: 'space-between' }}>
          {!!chainName ?
          <Box sx={{ p: `4px 8px`, display: 'flex', alignItems: 'center', borderRadius: 3, backgroundColor: '#EEE' }} >
            <img src={getChainLogo(selectedChain, paraId)} style={{ width: 32, height: 32, marginRight: 8, backgroundColor: '#F7F7FA', borderRadius: 16}} alt={"logo"}/>
            <Typography variant="h6">{chainName}</Typography>
          </Box> : null}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <BackingPieChart data={pieChartsData} size="md" />
          <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Typography variant="caption" align='right' sx={{ mr: 2 }}>Val. Group {groupId}</Typography>
            <List dense sx={{ mr: -1}} >
              {validatorsOrderedByPoints.map((v, i) => (
                <ListItemButton key={i} sx={{ borderRadius: 30}} disableRipple 
                  onClick={() => handleAddressSelected(v.address)}>
                  <ListItemText align="right" sx={{whiteSpace: "nowrap", }}
                    primary={nameDisplay(!!v.identity ? v.identity : stashDisplay(v.address, 4), 12)}
                  />
                  <ListItemIcon sx={{minWidth: 0, ml: 1, display: 'flex', alignItems: 'center'}}>
                    <Identicon
                      value={v.address}
                      size={24}
                      theme={'polkadot'} />
                    <span style={{ width: '4px', height: '4px', marginLeft: '8px', marginRight: '-4px', borderRadius: '50%', 
                      backgroundColor: theme.palette.grade[grade(1-calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv))],
                      display: "inline-block" }}></span>
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
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