import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GradesPieChart from './GradesPieChart';
import { 
  selectGradesBySession
 } from '../features/api/sessionsSlice'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

const emptyBox = ({theme, dark}) => {
  return (
    <Paper sx={{
      p: 2,
      display: 'flex',
      // flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: dark ? theme.palette.background.secondary : 'default'
    }} />
  )
}

export default function GradesSmallBox({sessionIndex, dark}) {
  const theme = useTheme();
  const rawGrades = useSelector(state => selectGradesBySession(state, sessionIndex));

  if (!rawGrades.length) {
    return emptyBox({theme, dark})
  }

  const currentGrades = rawGrades.filter(g => !isUndefined(g) && !isNull(g) && g !== '-')

  if (!currentGrades.length) {
    return emptyBox({theme, dark})
  }

  const gradesData = grades.map(g => {
    const quantity = currentGrades.filter(cg => cg === g).length;
    const percentage = Math.round(quantity * 100 / currentGrades.length);
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
        bgcolor: dark ? theme.palette.background.secondary : 'default'
      }}>
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>session grade majority</Typography>
          <Typography variant="h5" color={dark ? theme.palette.text.secondary : 'default'}>{`${topGrade.name}`}</Typography>
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : 'default'}>
            {`${topGrade.quantity} para-authorities`}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <GradesPieChart data={gradesData} size="sm" dark={dark} />
      </Box>
    </Paper>
  );
}