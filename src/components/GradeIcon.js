import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
// import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'
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

export default function GradeIcon({sessionIndex, address, size = 96}) {
  // const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))

  if (isUndefined(validator)) {
    return null
  }
  
  const gradeValue = !isUndefined(validator.para_summary) ? grade(1 - calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv)) : undefined;

  if (isUndefined(gradeValue)) {
    return null
  }

  return (
    <Tooltip title={`Para-Authority grade performance for session ${sessionIndex}.`} arrow>
      <img src={GRADES[gradeValue]} style={{ 
          width: size,
          height: "auto" }} alt={`Grade: ${gradeValue}`}/>
    </Tooltip>  
  );
}