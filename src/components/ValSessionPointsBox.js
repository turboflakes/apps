import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';

export default function ValSessionPointsBox({address}) {
  // const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  
  if (isUndefined(validator)) {
    return null
  }

  if (!validator.is_auth) {
    return null
  }

  const total = validator.auth.ep - validator.auth.sp > 0 ? validator.auth.ep - validator.auth.sp : 0;
  
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
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>session points</Typography>
        <Typography variant="h5">
          {!isUndefined(total) ? total.format() : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {`since session ${currentSession.format()} started`}
        </Typography>
      </Box>
    </Paper>
  );
}