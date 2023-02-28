import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Tooltip from './Tooltip';
import PoolsStatesPieChart from './PoolsStatesPieChart';

import { 
  selectPoolsAll,
  selectTotalOpen
 } from '../features/api/poolsMetadataSlice';

import { 
  selectTotalActiveBySession
 } from '../features/api/poolsSlice';

const states = ["Open", "Destroying", "Blocked"]

export default function PoolsActiveBox({sessionIndex, dark}) {
  const theme = useTheme();
  const allPools = useSelector(selectPoolsAll);
  const totalOpen = useSelector(selectTotalOpen);
  const activePools = useSelector(state => selectTotalActiveBySession(state, sessionIndex));
  
  if (!allPools.length) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

  const poolsData = states.map(state => {
    const quantity = allPools.filter(pool => pool.state === state).length;
    const percentage = Math.round(quantity * 100 / allPools.length);
    return {
      name: state,
      value: percentage,
      quantity,
    }
  });

  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: dark ? theme.palette.background.secondary : 'default'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}
          color={dark ? theme.palette.text.secondary : 'default'}>total pools open</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : 'default'}>
          {totalOpen}
        </Typography>
        <Tooltip title={`${activePools} pools are active nominating validators`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}
            color={dark ? theme.palette.text.secondary : 'default'}>
            {activePools} active nominations
          </Typography>
        </Tooltip>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <PoolsStatesPieChart data={poolsData} size="sm" dark={dark} />
      </Box>
    </Paper>
  );
}