import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  selectValidatorBySessionAndAddress
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';


export default function ValDisputesBox({address, maxSessions}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  
  if (isUndefined(validator) || isUndefined(validator.para) || isUndefined(validator.para.disputes)) {
    return null
  }

  const disputesTotal = validator.para.disputes.length;
  const lastDispute = validator.para.disputes[validator.para.disputes.length - 1];
  const lastDisputeBlock = lastDispute[0];
  
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
        bgcolor: theme.palette.semantics.red,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" color="textSecondary" sx={{whiteSpace: 'nowrap'}}>disputes initiated</Typography>
        <Typography variant="h5" color="textSecondary">
          {!isUndefined(disputesTotal) ? disputesTotal : '-'}
        </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
            last seen at block #{!isUndefined(lastDisputeBlock) ? lastDisputeBlock.format() : '-'}
          </Typography>
      </Box>
    </Paper>
  );
}