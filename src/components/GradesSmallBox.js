import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GradesPieChart from './GradesPieChart';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice'
import { grade } from '../util/grade'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

export default function GradesSmallBox({sessionIndex}) {
  // const theme = useTheme();
  const rawMvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (!rawMvrs.length) {
    return null
  }

  const mvrs = rawMvrs.filter(mvr => !isUndefined(mvr) && !isNull(mvr))

  if (!mvrs.length) {
    return null
  }

  const gradesData = grades.map(g => {
    const quantity = mvrs.filter(mvr => grade(1 - mvr) === g).length;
    const percentage = quantity * 100 / mvrs.length;
    return {
      name: g,
      value: percentage,
      quantity,
    }
  });

  const sortedGrades = gradesData.slice().filter(a => !!a.quantity).sort((a, b) => b.value - a.value);
  const topGrade = sortedGrades[0];
  // const bottomGrade = sortedGrades[sortedGrades.length - 1];
  return (
    <Paper 
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px', 
      }}>
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">session grade majority</Typography>
          <Typography variant="h5">{`${topGrade.name}`}</Typography>
          <Typography variant="subtitle2">
            {`${topGrade.quantity} para-authorities`}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <GradesPieChart data={gradesData} size="sm" />
      </Box>
    </Paper>
  );
}