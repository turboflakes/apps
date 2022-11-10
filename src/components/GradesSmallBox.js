import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { BarChart, Bar, Cell, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import GradesPieChart from './GradesPieChart';
import {
  selectFinalizedBlock,
  selectBlockById,
} from '../features/api/blocksSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  getBlocksPerSessionTarget
} from '../constants'
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice'
import { grade } from '../util/grade'

const grades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]

const renderTooltip = (props, theme) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          minWidth: '368px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>Para-Authorities by grade</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <i>Session {data.session.format()}</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>At block #{data.currentBlock.format()}: <b>{data.value.format()}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>At block #{data.previousBlock.format()} (previous session): <b>{data.previous.format()}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function GradesSmallBox({sessionIndex}) {
  // const theme = useTheme();
  const mvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
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
            {`${topGrade.quantity} (${topGrade.value}%) validators`}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <GradesPieChart data={gradesData} size="sm" />
      </Box>
    </Paper>
  );
}