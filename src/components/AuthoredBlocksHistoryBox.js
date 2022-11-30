import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { 
  selectSessionByIndex
 } from '../features/api/sessionsSlice';

export default function AuthoredBlocksHistoryBox({sessionIndex}) {
  const theme = useTheme();
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex));

  if (isUndefined(session) || isUndefined(session.stats)) {
    return null
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
        bgcolor: theme.palette.background.secondary
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} 
          color={theme.palette.text.secondary} >authored blocks</Typography>
        <Typography variant="h5" color={theme.palette.text.secondary} >
          {!isUndefined(session.stats.ab) ? session.stats.ab : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}
          color={theme.palette.text.secondary} >
          {`last #${session.ebix.format()}`}
        </Typography>
      </Box>
    </Paper>
  );
}