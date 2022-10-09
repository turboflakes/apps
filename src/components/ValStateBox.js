import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'

export default function ValStateBox({address, sessionIndex, dark}) {
  const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))
  
  if (isUndefined(validator)) {
    return null
  }
  const status = validator.is_auth && validator.is_para ? 'Para-Authority' : (validator.is_auth ? 'Authority' : 'Not Authority');
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: dark ? theme.palette.background.secondary : theme.palette.background.primary
      }}
      >
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>Status</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{status}</Typography>
      </Box>
    </Paper>
  );
}