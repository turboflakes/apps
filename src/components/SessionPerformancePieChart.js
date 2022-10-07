import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import isNaN from 'lodash/isNaN'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'

function createData(name, value) {
  return { name, value };
}
const COLORS = ['#343434', '#C8C9CC'];

export default function SessionPerformancePieChart() {
  const theme = useTheme();
  const {isSuccess} = useGetBlockQuery("finalized");
  const blocks = useSelector(selectAll)
  
  if (!isSuccess) {
    return null
  }

  const block = blocks[blocks.length-2]
  const previousBlock = blocks[blocks.length-3]
  if (isUndefined(block)) {
    return null
  }
  
  const pieData = [
    createData('done', Math.round((1 - block._mvr) * 100)),
    createData('progress', Math.round(block._mvr * 100)),
  ];

  const trend = !isUndefined(previousBlock) ? (1 - block._mvr) - (1 - previousBlock._mvr) : 0
  const trendPer = Math.round((trend) * 10000) / 10000

  return (
    <Paper
      sx={{
        p: `16px 24px`,
        display: 'flex',
        alignItems: 'flex-start',
        // justifyContent: 'space-between',
        // flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">Backing Subsystem performance</Typography>
          <Typography variant="h5">{!isUndefined(block._mvr) ? `${Math.round((1 - block._mvr) * 100)}%` : '-'}</Typography>
          <Typography variant="subtitle2" 
              sx={{color: Math.sign(trendPer) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red}}>
          {!isNaN(trendPer) ? (trendPer !== 0 ? `${trendPer}%` : ``) : ''}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'flex-end'}}>
        <PieChart width={100} height={80} margin={{top: 40}}>
          <Pie
              dataKey="value"
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={36}
              innerRadius={24}
              startAngle={210}
              endAngle={-30}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            {/* <text x="50%" y="50%" fill="#343434" style={{ fontSize: '1rem' }} textAnchor={'middle'} dominantBaseline="central">
              {Math.round((1 - block._mvr) * 100)}%
            </text> */}
        </PieChart>
      </Box>
    </Paper>
  );
}