import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'

export default function GradeHistoryIcon({address, maxSessions}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  
  if (!validators.length) { 
    return null
  }

  const filtered = validators.filter(v => v.is_auth && v.is_para);
  
  const mvr = calculateMvr(
    filtered.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0)
  );

  const gradeValue = grade(1 - mvr);

  if (!gradeValue) {
    return null
  }
  
  return (
    <Box sx={{ ml: 2, width: 64, height: 64, borderRadius: '50%', 
              bgcolor: theme.palette.grade[gradeValue], 
              display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
      <Tooltip title={`Para-Authority grade for the last ${maxSessions} sessions.`} arrow>
        <Box sx={{ width: 54, height: 54, borderRadius: '50%', 
              bgcolor: "#fff", 
              display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
          <Typography variant="h5">{gradeValue}</Typography>
        </Box>
      </Tooltip>
    </Box>
  );
}