import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice'
import { grade } from '../util/grade'

export default function GradeDescription({sessionIndex, good, poor, verbose}) {
  const theme = useTheme();
  const mvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (!mvrs.length) {
    return null
  }
  const classifications = poor ? ["D+", "D", "F"] : ["A+", "A", "B+", "B"];
  const grades = mvrs.filter(mvr => classifications.includes(grade(1 - mvr)))
  const percent = (grades.length * 100)  / mvrs.length
  const average = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10000) / 10000
  
  return (
    <React.Fragment>
    { poor && grades.length > 0 ? 
      <Typography variant="subtitle2" sx={{ color: theme.palette.semantics.red}}>
        {`${grades.length} Para-Authorities needs attention!`}  
      </Typography> : null }
    { good && grades.length > 0 ?
      <Typography variant="subtitle2">
        {`${percent}% of Para-Authorities have a good performance.`}
      </Typography> : null}
    { good && verbose && grades.length > 0 ?
      <Typography variant="subtitle2">
        {`${percent}% of Para-Authorities have a good performance with an average missed vote ratio of ${average}`}
      </Typography> : null}
    </React.Fragment>
  )
}