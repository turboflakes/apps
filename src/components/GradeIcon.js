import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'

export default function GradeIcon({sessionIndex, address}) {
  const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))

  if (isUndefined(validator)) {
    return null
  }
  
  const gradeValue = !isUndefined(validator.para_summary) ? grade(1 - calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv)) : undefined;

  if (isUndefined(gradeValue)) {
    return null
  }

  return (
      <Box sx={{ ml: 2, width: 64, height: 64, borderRadius: '50%', 
                bgcolor: theme.palette.grade[gradeValue], 
                display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
        <Tooltip title={`Para-Validator grade for the session ${sessionIndex}.`} arrow>
          <Box sx={{ width: 54, height: 54, borderRadius: '50%', 
                bgcolor: "#fff", 
                display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
            <Typography variant="h5">{gradeValue}</Typography>
          </Box>
        </Tooltip>
      </Box>
  );
}