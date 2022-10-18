import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import {
  selectSessionByIndex,
  selectSessionCurrent,
  selectEraPointsBySession
} from '../features/api/sessionsSlice';

export default function EraPointsBox() {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  // const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  const session = useSelector(state => selectSessionByIndex(state, currentSession))
  const eraPoints = useSelector(state => selectEraPointsBySession(state, currentSession))

  if (isUndefined(session)) {
    return null
  }

  console.log("__eraPoints", eraPoints);
  // const total = validator.auth.ep;
  const total = 0 
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
        // bgcolor: theme.palette.neutrals[200],
        bgcolor: theme.palette.background.secondary,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" color="textSecondary" sx={{whiteSpace: 'nowrap'}}>Era Points</Typography>
        <Typography variant="h5" color="textSecondary">
          {!isUndefined(total) ? total.format() : '-'}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
          {`Since era ${session.eix.format()} started`}
        </Typography>
      </Box>
    </Paper>
  );
}