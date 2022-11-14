import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Typography } from '@mui/material';
import { 
  useGetBlocksQuery,
  selectBlocksBySession,
 } from '../features/api/blocksSlice'


 const renderTooltip = (props, identiy, theme) => {
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
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Box sx={{mb: 2}}>
          <Typography component="div" variant="caption" color="inherit">
            <b>Finalized block</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`# ${data.block}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption" color="inherit">
            Backing vote ratio: <b>{Math.round(data.bvr * 1000000) / 1000000}</b>
          </Typography>
        </Box>
        
        
      </Box>
    );
  }

  return null;
};

export default function SessionPerformanceTimeline({sessionIndex}) {
  const theme = useTheme();
  const {isSuccess} = useGetBlocksQuery({session: sessionIndex, show_stats: true});
  const blocks = useSelector(state => selectBlocksBySession(state, sessionIndex))
  
  if (!isSuccess) {
    return null
  }
  
  const filtered = blocks.filter(b => !isUndefined(b._mvr))
  
  // Minimum of 4 blocks to draw a trend
  if (filtered.length < 4 ) {
    return null
  }
  
  const timelineData = filtered.map(o => ({
    block: o.block_number.format(),
    bvr: 1 - o._mvr
  }))

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" gutterBottom>network trend in the last {filtered.length} finalized blocks</Typography>
        </Box>
      </Box>
      <Box sx={{height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%" sx={{ py: 1}}>
          <LineChart
            ani
            // width="100%"
            height="100%"
            data={timelineData}
            margin={{
              top: 5,
              right: 20,
              left: -50,
              bottom: -20,
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
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
            <Line isAnimationActive={false} type="monotone" dataKey="bvr" 
              strokeWidth={2} stroke="#0B1317" fill="#F1F1F0" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}