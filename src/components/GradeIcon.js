import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  useGetValidatorGradeByAddressQuery,
 } from '../features/api/validatorsSlice'
import { gradeByRatios } from '../util/grade'
import { calculateMVR, calculateBUR, calculateMCR } from '../util/math'
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

const gradeOf = (data) => {
  const mcr = calculateMCR(
    data.collation_produced_blocks_total + data.collation_missed_blocks_total,
    data.collation_produced_blocks_total,
  )
  if (!Number.isFinite(mcr)) {
    return data.grade
  }
  const grade = gradeByRatios(
    calculateMVR(data.explicit_votes_total, data.implicit_votes_total, data.missed_votes_total),
    calculateBUR(data.bitfields_availability_total, data.bitfields_unavailability_total),
    mcr,
  )
  return grade !== '-' ? grade : data.grade
}

export default function GradeIcon({sessionIndex, address, size = 96, maxSessions}) {

  const {data, isFetching, isSuccess, isError} = useGetValidatorGradeByAddressQuery({address, number_last_sessions: maxSessions});

  if (isFetching || isError) {
    return (
      <Tooltip title={`Grade not available.`} arrow>
        <img src={GRADES['-']} style={{
            width: "auto",
            height: size }} alt={`Grade not available.`}/>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Validator grade for the last ${maxSessions} sessions.`} arrow>
      <img src={GRADES[isSuccess ? gradeOf(data) : '-']} style={{
          width: "auto",
          height: size }} alt={isSuccess ? `Grade: ${gradeOf(data)}` : '-' }/>
    </Tooltip>
  );
}
