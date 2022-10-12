import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import {
  selectSessionByIndex,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'

const ORDER = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export default function ValStateBox({address, sessionIndex, dark}) {
  const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))
  // const currentSession = useSelector(selectSessionCurrent);
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  
  if (isUndefined(validator) || isUndefined(session)) {
    return null
  }

  const status = validator.is_auth && validator.is_para ? 'Para-Authority' : (validator.is_auth ? 'Authority' : 'Not Authority');
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: dark ? theme.palette.background.secondary : theme.palette.background.primary
      }}
      >
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column'}}>
        <Typography variant="caption" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>Validator status</Typography>
        <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }} 
          color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{status}</Typography>
        <Typography variant="subtitle2"
          color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{`At ${ORDER[session.esix-1]} session of era ${session.eix.format()}`}</Typography>
      </Box>
    </Paper>
  );
}