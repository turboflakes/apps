import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'

export default function SessionPerformanceTimeline() {
  // const theme = useTheme();
  const {isSuccess} = useGetBlockQuery("best");
  const blocks = useSelector(selectAll)
  
  if (!isSuccess) {
    return null
  }

  // Minimum of 4 blocks to draw a trend
  if (blocks.length < 4 ) {
    return null
  }
  
  const filtered = blocks.slice(0, blocks.length-1)
  const timelineData = filtered.map(o => ({
    block: o.block_number.format(),
    mvr: 1 - o._mvr
  }))

  return (
    <Paper
      sx={{
        // p: `16px 24px`,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        height: 112,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ p:`16px 24px`, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">Backing Subsystem trend in the last {blocks.length} blocks</Typography>
        </Box>
      </Box>
        <ResponsiveContainer width="100%" height="100%" sx={{borderRadius: 30}}>
          <LineChart
            ani
            // width="100%"
            // height={300}
            data={timelineData}
            margin={{
              top: 5,
              right: 20,
              left: -50,
              bottom: -10,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1317" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#F1F1F0" stopOpacity={0.5}/>
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="block" interval={0} angle={-45} dx={20} fontSize="0.75rem" 
              tick={false}
              tickLine={false}
              axisLine={false} />
            <YAxis type="number" domain={['auto', 'dataMax']} 
              tick={false}
              tickLine={false}
              axisLine={false} />
            {/* <Tooltip /> */}
            <Line isAnimationActive={false} type="monotone" dataKey="mvr" 
              strokeWidth={2} stroke="#0B1317" fill="#F1F1F0" dot={false} />
          </LineChart>
        </ResponsiveContainer>
    </Paper>
  );
}