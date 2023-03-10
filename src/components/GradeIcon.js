import * as React from 'react';
// import { useSelector } from 'react-redux';
// import isUndefined from 'lodash/isUndefined'
// import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { 
  useGetValidatorGradeByAddressQuery,
 } from '../features/api/validatorsSlice'
// import { grade } from '../util/grade'
// import { calculateMvr } from '../util/mvr'
import gradeAplus from '../assets/grades/grade_a_plus.webp';
import gradeA from '../assets/grades/grade_a.webp';
import gradeBplus from '../assets/grades/grade_b_plus.webp';
import gradeB from '../assets/grades/grade_b.webp';
import gradeCplus from '../assets/grades/grade_c_plus.webp';
import gradeC from '../assets/grades/grade_c.webp';
import gradeDplus from '../assets/grades/grade_d_plus.webp';
import gradeD from '../assets/grades/grade_d.webp';
import gradeF from '../assets/grades/grade_f.webp';
import emptyGrade from '../assets/grades/empty_grade.svg';

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
  "-" : emptyGrade
}

export default function GradeIcon({sessionIndex, address, size = 96, maxSessions}) {
  // const theme = useTheme();
  
  const {data, isFetching, isSuccess, isError} = useGetValidatorGradeByAddressQuery({address, number_last_sessions: maxSessions});
  // const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))

  if (isFetching || isError) {
    return (
      <Tooltip title={`Grade not available.`} arrow>
        <img src={GRADES['-']} style={{ 
            width: size,
            height: "auto" }} alt={`Grade not available.`}/>
      </Tooltip>  
    );
  }
  
  // const gradeValue = !isUndefined(validator.para_summary) ? 
  //   grade(1 - calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv)) : "-";

  return (
    <Tooltip title={`Validator grade for the last ${maxSessions} sessions.`} arrow>
      <img src={GRADES[isSuccess ? data.grade : '-']} style={{ 
          width: size,
          height: "auto" }} alt={isSuccess ? `Grade: ${data.grade}` : '-' }/>
    </Tooltip>  
  );
}