import * as React from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice'
import { grade } from '../util/grade'

export default function GradeDescription({sessionIndex, gradeValue}) {
  const mvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (!mvrs.length) {
    return null
  }
  const grades = mvrs.filter(mvr => grade(1 - mvr) === gradeValue)
  const percent = grades.length * 100  / mvrs.length
  const average = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10000) / 10000
  
  return (
    <Typography variant="subtitle2">
      {`${percent}% of para validators in the current session have an exceptional performance (${gradeValue}) with an average missed vote ratio of ${average}`}
    </Typography>
  )
}