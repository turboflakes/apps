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
import {
  selectValProfileByAddress,
} from '../features/api/valProfilesSlice';

export default function ValAuthoredBlocksBox({address}) {
  // const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));

  if (isUndefined(validator) || isUndefined(valProfile)) {
    return null
  }

  if (!validator.is_auth) {
    return null
  }

  const total = validator.auth.ab.length;
  const description = total > 0 ? `Last # ${validator.auth.ab[total - 1].format()}` : '';
  
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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>authored blocks</Typography>
        <Typography variant="h5">
          {!isUndefined(total) ? total : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}