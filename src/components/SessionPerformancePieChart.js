import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import isNaN from 'lodash/isNaN'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectFinalizedBlock,
  selectPreviousFinalizedBlock
 } from '../features/api/blocksSlice'
function createData(name, value) {
  return { name, value };
}

export default function SessionPerformancePieChart() {
  const theme = useTheme();
  const {isSuccess} = useGetBlockQuery({blockId: "finalized", show_stats: true});
  const finalized = useSelector(selectFinalizedBlock)
  const previousFinalized = useSelector(selectPreviousFinalizedBlock)
  
  if (!isSuccess || isUndefined(finalized) || isUndefined(previousFinalized)) {
    return null
  }

  const pieData = [
    createData('done', Math.round((1 - finalized._mvr) * 100)),
    createData('progress', Math.round(finalized._mvr * 100)),
  ];

  const trend = (1 - finalized._mvr) - (1 - previousFinalized._mvr)
  const trendPer = Math.round((trend) * 10000) / 10000

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        // justifyContent: 'space-between',
        // flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">network performance</Typography>
          <Typography variant="h5">{!isUndefined(finalized._mvr) ? `${Math.round((1 - finalized._mvr) * 100)}%` : '-'}</Typography>
          <Typography variant="subtitle2" 
              sx={{color: Math.sign(trendPer) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red}}>
          {!isNaN(trendPer) ? (trendPer !== 0 ? `${trendPer}%` : ``) : ''}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ px: 1, width: '50%', display: 'flex', justifyContent: 'flex-end'}}>
        <PieChart width={100} height={80} margin={{top: 40}}>
          <Pie
              dataKey="value"
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={36}
              innerRadius={24}
              startAngle={180}
              endAngle={0}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} strokeWidth={0} stroke={theme.palette.neutrals[300]}
                  fill={index === 0 ? theme.palette.text.primary : theme.palette.grey[200] } />
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