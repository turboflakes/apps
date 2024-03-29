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
  selectChainInfo,
} from '../features/chain/chainSlice';
import { 
  selectTotalPointsBySession
 } from '../features/api/poolsSlice';
import { 
  getSessionsPerDayTarget 
} from '../constants'
import { stakeDisplay } from '../util/display';


export default function PoolsPointsBox({sessionIndex, isFetching, dark}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const selectedChainInfo = useSelector(selectChainInfo);
  const nSessionsTarget = getSessionsPerDayTarget(selectedChain);
  const currentValue = useSelector(state => selectTotalPointsBySession(state, sessionIndex));
  const previousValue = useSelector(state => selectTotalPointsBySession(state, sessionIndex - nSessionsTarget));

  if (isUndefined(currentValue) || currentValue === 0 || 
    isUndefined(previousValue) || isUndefined(selectedChainInfo)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

  const diff = !isUndefined(previousValue) ? currentValue - previousValue : 0;

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
          color={dark ? theme.palette.text.secondary : 'default'}>total points</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : 'default'}>
          {stakeDisplay(currentValue, selectedChainInfo, 2, true, false)}
        </Typography>
        {diff !== 0 ? 
          <Tooltip title={`${stakeDisplay(Math.abs(diff), selectedChainInfo, 2, true, false)} points ${Math.sign(diff) > 0 ? 'more' : 'less'} than ${nSessionsTarget} sessions ago.`} arrow>
            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', 
              lineHeight: 0.875,
              color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}>
              <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${stakeDisplay(Math.abs(diff), selectedChainInfo, 4, false, false)}` : `-${stakeDisplay(Math.abs(diff), selectedChainInfo, 4, false, false)}`) : ' '}</b>
            </Typography>
          </Tooltip> : null}
      </Box>
    </Paper>
  );
}