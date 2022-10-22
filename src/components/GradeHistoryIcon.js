import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
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
import gradeAplus from '../assets/grades/grade_a_plus.webp';
import gradeA from '../assets/grades/grade_a.webp';
import gradeBplus from '../assets/grades/grade_b_plus.webp';
import gradeB from '../assets/grades/grade_b.webp';
import gradeCplus from '../assets/grades/grade_c_plus.webp';
import gradeC from '../assets/grades/grade_c.webp';
import gradeDplus from '../assets/grades/grade_d_plus.webp';
import gradeD from '../assets/grades/grade_d.webp';
import gradeF from '../assets/grades/grade_f.webp';

const GRADES = {
  "A+" : gradeAplus,
  "A" : gradeA,
  "B+" : gradeBplus,
  "B" : gradeB,
  "C+" : gradeCplus,
  "C" : gradeC,
  "D+" : gradeDplus,
  "D" : gradeD,
  "F" : gradeF,
}

export default function GradeHistoryIcon({address, maxSessions, size = 96}) {
  // const theme = useTheme();
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
    <Box>
      <Tooltip title={`Para-Authority grade for the last ${maxSessions} sessions.`} arrow>
        <img src={GRADES[gradeValue]} style={{ 
            width: size,
            height: "auto" }} alt={`Grade: ${gradeValue}`}/>
      </Tooltip>
    </Box>
  );
}