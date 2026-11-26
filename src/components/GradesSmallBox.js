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

const emptyBox = ({theme, dark, height = 96}) => {
  return (
    <Paper sx={{
      p: 2,
      display: 'flex',
      // flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: dark ? theme.palette.background.secondary : 'default'
    }} />
  )
}

// NOTE: `grades` overrides the grades of the session (e.g. collators only)
export default function GradesSmallBox({
  sessionIndex, dark, grades: gradesProp, label = 'top grade',
  unit = 'para-authorities', variant = 'h5', height = 96, pieSize = 'sm' }) {
  const theme = useTheme();
  const sessionGrades = useSelector(state => selectGradesBySession(state, sessionIndex));
  const rawGrades = gradesProp ?? sessionGrades;

  if (!rawGrades.length) {
    return emptyBox({theme, dark, height})
  }

  const currentGrades = rawGrades.filter(g => !isUndefined(g) && !isNull(g) && g !== '-')

  if (!currentGrades.length) {
    return emptyBox({theme, dark, height})
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
        height,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: 'default'
      }}>
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>{label}</Typography>
          <Typography variant={variant} color={dark ? theme.palette.text.secondary : 'default'}>{`${topGrade.name}`}</Typography>
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : 'default'}>
            {`${topGrade.quantity} ${unit}`}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <GradesPieChart data={gradesData} size={pieSize} dark={dark} />
      </Box>
    </Paper>
  );
}
