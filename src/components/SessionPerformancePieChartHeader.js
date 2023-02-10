import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import isNaN from 'lodash/isNaN';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
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

export default function SessionPerformancePieChartHeader() {
  const theme = useTheme();
  const {isSuccess, isFetching} = useGetBlockQuery({blockId: "finalized", show_stats: true});
  const finalized = useSelector(selectFinalizedBlock)
  const previousFinalized = useSelector(selectPreviousFinalizedBlock)
  
  if (isFetching || isUndefined(finalized) || isUndefined(previousFinalized)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 50,
      bgcolor: 'white'
    }} />)
  }

  if (!isSuccess) {
    return null
  }

  const pieData = [
    createData('done', Math.round((1 - finalized._mvr) * 100)),
    createData('progress', Math.round(finalized._mvr * 100)),
  ];

  const trend = (1 - finalized._mvr) - (1 - previousFinalized._mvr)
  const trendPer = Math.round((trend) * 10000) / 10000

  const trendSign = (trend) => Math.sign(trend) > 0 ? '↑' : ( Math.sign(trend) < 0 ? '↓' : '');

  return (
    <Box
      sx={{
        mx: 1,
        display: 'flex',
        alignItems: 'center',
        width: 224
      }}
      >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <PieChart width={64} height={64} margin={{top: 25}}>
          <Pie
              dataKey="value"
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={20}
              innerRadius={12}
              startAngle={180}
              endAngle={0}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} strokeWidth={0} stroke={theme.palette.neutrals[300]}
                  fill={index === 0 ? theme.palette.text.primary : theme.palette.grey[200] } />
              ))}
            </Pie>
        </PieChart>
      </Box>
      <Box sx={{ mx: 1, width: '60%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption1">network performance</Typography>
          <Box sx={{display: 'flex'}}>
            <Typography variant="h6">
              {!isUndefined(finalized._mvr) ? `${Math.round((1 - finalized._mvr) * 100)}%` : '-'}
              <span style={{
                ...theme.typography.subtitle3,
                marginLeft: '16px',
                color: Math.sign(trendPer) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red
              }}>{!isNaN(trendPer) ? (Math.sign(trendPer) !== 0 ? `${trendSign(trendPer)} ${Math.abs(trendPer)}%` : ``) : ''}</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}