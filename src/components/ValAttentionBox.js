import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { 
  selectSessionCurrent
 } from '../features/api/sessionsSlice';
import {
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import { calculateMvr } from '../util/mvr'

import { grade } from '../util/grade';

export default function ValAttentionBox({address}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  
  if (isUndefined(validator) || isUndefined(validator.is_para) || isUndefined(validator.para_summary)) {
    return null
  }

  const mvr = Math.round(calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv) * 10000) / 10000;

  if (isNaN(mvr)) {
    return null
  }

  if (grade(1 - mvr) !== "F" && isUndefined(validator.para.disputes)) {
    return null
  }
  
  return (
    <Paper sx={{
        p: 4,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: theme.palette.semantics.red
      }}>
        <Typography variant="h6" color="textSecondary" align='center'>
          <b>Validator needs attention!</b>
        </Typography>
    </Paper>
  );
}