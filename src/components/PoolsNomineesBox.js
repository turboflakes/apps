import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Tooltip from './Tooltip';

import {
  selectChain,
} from '../features/chain/chainSlice';
import { 
  selectTotalNomineesBySession,
  selectTotalUniqueNomineesBySession
 } from '../features/api/poolsSlice';
import { 
  getSessionsPerDayTarget 
} from '../constants'

export default function PoolNomineesBox({sessionIndex, dark}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const nSessionsTarget = getSessionsPerDayTarget(selectedChain);
  const currentValue = useSelector(state => selectTotalNomineesBySession(state, sessionIndex));
  const currentUnique = useSelector(state => selectTotalUniqueNomineesBySession(state, sessionIndex));
  
  if (isUndefined(currentValue) || currentValue === 0 || isUndefined(currentUnique)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

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
          color={dark ? theme.palette.text.secondary : 'default'}>total nominees</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : 'default'}>
          {currentValue}
        </Typography>
        <Tooltip title={`${currentUnique} distinct validators.`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}
            color={dark ? theme.palette.text.secondary : 'default'}>
            {currentUnique} distinct validators
          </Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}