import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import {
  AreaChart,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  selectChain
} from '../features/chain/chainSlice';
import { isChainSupported, getChainNameShort, getChainColor } from '../constants'


function createData(x, y, a, m, p, z) {
  return { x, y, a, m, p, z };
}

const data = [
  [createData(1,1,7,0,140,7),createData(2,1,7,0,140,7),createData(3,1,7,0,140,7),createData(4,1,5,2,100,7),createData(5,1,7,0,140,7),],
[createData(1,2,7,0,160,7),createData(2,2,7,0,160,7),createData(3,2,7,0,160,7),createData(4,2,7,0,160,7),createData(5,2,7,0,160,7),],
[createData(1,3,7,0,120,7),createData(2,3,7,0,120,7),createData(3,3,7,0,120,7),createData(4,3,5,2,80,7),createData(5,3,7,0,120,7),],
[createData(1,4,8,0,200,8),createData(2,4,8,0,200,8),createData(3,4,8,0,200,8),createData(4,4,8,0,180,8),createData(5,4,8,0,200,8),],
[createData(1,5,7,0,140,7),createData(2,5,7,0,140,7),createData(3,5,7,0,140,7),createData(4,5,5,2,100,7),createData(5,5,7,0,140,7),],
[createData(1,6,8,0,180,8),createData(2,6,8,0,180,8),createData(3,6,8,0,180,8),createData(4,6,7,1,140,8),createData(5,6,8,0,180,8),],
[createData(1,7,0,0,0,0),createData(2,7,0,0,0,0),createData(3,7,0,0,0,0),createData(4,7,0,0,0,0),createData(5,7,0,0,0,0),],
[createData(1,8,4,0,80,4),createData(2,8,4,0,80,4),createData(3,8,4,0,80,4),createData(4,8,4,0,80,4),createData(5,8,4,0,80,4),],
[createData(1,9,4,0,100,4),createData(2,9,4,0,100,4),createData(3,9,4,0,100,4),createData(4,9,4,0,100,4),createData(5,9,4,0,100,4),],
[createData(1,10,1,2,40,3),createData(2,10,3,0,80,3),createData(3,10,3,0,80,3),createData(4,10,3,0,60,3),createData(5,10,1,2,40,3),],
[createData(1,11,4,0,60,4),createData(2,11,4,0,60,4),createData(3,11,4,0,60,4),createData(4,11,0,4,0,4),createData(5,11,4,0,60,4),],
[createData(1,12,1,0,20,1),createData(2,12,1,0,20,1),createData(3,12,1,0,20,1),createData(4,12,1,0,20,1),createData(5,12,1,0,20,1),],
[createData(1,13,4,0,80,4),createData(2,13,4,0,80,4),createData(3,13,4,0,80,4),createData(4,13,4,0,80,4),createData(5,13,4,0,80,4),],
[createData(1,14,3,0,80,3),createData(2,14,3,0,80,3),createData(3,14,3,0,80,3),createData(4,14,3,0,80,3),createData(5,14,3,0,80,3),],
[createData(1,15,5,0,80,5),createData(2,15,5,0,80,5),createData(3,15,5,0,80,5),createData(4,15,5,0,80,5),createData(5,15,5,0,80,5),],
[createData(1,16,4,0,80,4),createData(2,16,4,0,80,4),createData(3,16,4,0,80,4),createData(4,16,4,0,80,4),createData(5,16,4,0,80,4),],
[createData(1,17,2,0,60,2),createData(2,17,2,0,60,2),createData(3,17,2,0,60,2),createData(4,17,0,2,0,2),createData(5,17,2,0,60,2),],
[createData(1,18,1,0,20,1),createData(2,18,1,0,20,1),createData(3,18,1,0,20,1),createData(4,18,0,1,20,1),createData(5,18,1,0,20,1),],
[createData(1,19,5,0,100,5),createData(2,19,5,0,100,5),createData(3,19,5,0,100,5),createData(4,19,5,0,100,5),createData(5,19,5,0,100,5),],
[createData(1,20,4,0,60,4),createData(2,20,4,0,60,4),createData(3,20,4,0,60,4),createData(4,20,3,1,40,4),createData(5,20,4,0,60,4),],
[createData(1,21,3,0,80,3),createData(2,21,3,0,80,3),createData(3,21,3,0,80,3),createData(4,21,1,2,40,3),createData(5,21,3,0,80,3),],
[createData(1,22,2,0,40,2),createData(2,22,2,0,40,2),createData(3,22,2,0,40,2),createData(4,22,2,0,40,2),createData(5,22,2,0,40,2),],
[createData(1,23,4,1,80,5),createData(2,23,5,0,100,5),createData(3,23,5,0,100,5),createData(4,23,5,0,100,5),createData(5,23,5,0,100,5),],
[createData(1,24,4,0,60,4),createData(2,24,4,0,60,4),createData(3,24,4,0,60,4),createData(4,24,3,1,40,4),createData(5,24,4,0,60,4),],
[createData(1,25,2,0,60,2),createData(2,25,2,0,60,2),createData(3,25,2,0,60,2),createData(4,25,2,0,60,2),createData(5,25,2,0,60,2),],
[createData(1,26,4,0,60,4),createData(2,26,4,0,60,4),createData(3,26,4,0,60,4),createData(4,26,1,3,0,4),createData(5,26,4,0,60,4),],
[createData(1,27,4,0,80,4),createData(2,27,4,0,80,4),createData(3,27,4,0,80,4),createData(4,27,2,2,20,4),createData(5,27,4,0,80,4),],
[createData(1,28,3,1,60,4),createData(2,28,4,0,80,4),createData(3,28,4,0,80,4),createData(4,28,2,2,60,4),createData(5,28,4,0,80,4),],
[createData(1,29,0,0,20,0),createData(2,29,0,0,20,0),createData(3,29,0,0,20,0),createData(4,29,0,0,0,0),createData(5,29,0,0,20,0),],
[createData(1,30,7,0,120,7),createData(2,30,6,1,100,7),createData(3,30,6,1,100,7),createData(4,30,3,4,60,7),createData(5,30,7,0,120,7),],
[createData(1,31,0,0,20,0),createData(2,31,0,0,20,0),createData(3,31,0,0,20,0),createData(4,31,0,0,20,0),createData(5,31,0,0,20,0),],
[createData(1,32,7,0,120,7),createData(2,32,7,0,120,7),createData(3,32,7,0,120,7),createData(4,32,5,2,80,7),createData(5,32,7,0,120,7),],
[createData(1,33,2,1,40,3),createData(2,33,3,0,60,3),createData(3,33,3,0,60,3),createData(4,33,1,2,20,3),createData(5,33,3,0,60,3),],
[createData(1,34,0,0,0,0),createData(2,34,0,0,0,0),createData(3,34,0,0,0,0),createData(4,34,0,0,0,0),createData(5,34,0,0,0,0),],
]

const renderTooltip = (props) => {
  const { active, payload } = props;
  // console.log("_renderTooltip", active, payload);
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    // const unit = payload[2] && payload[2].unit;
    // return (
    //   <Box
    //     sx={{ 
    //       bgcolor: '#fff',
    //       // color: '#fff',
    //       p: 2,
    //       m: 0,
    //       borderRadius: 1,
    //       boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
    //      }}

    //   >
    //     <Typography component="div" variant="caption" color="inherit" gutterBottom>
    //       <b>{names[data.x-1].identity}</b>
    //     </Typography>
    //     <Typography component="div" variant="caption" color="inherit">
    //       accepted votes: {data.a}
    //     </Typography>
    //     <Typography component="div" variant="caption" color="inherit">
    //       missed votes: {data.m}
    //     </Typography>
    //     <Typography component="div" variant="caption" color="inherit">
    //       points: {data.p}
    //     </Typography>
    //   </Box>
    // );
  }

  return null;
};

export default function SessionPointsChart() {
  const theme = useTheme();

  

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 800,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Typography variant="h5">Backing votes</Typography>
        <Typography variant="subtitle2">Val. Group 5</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={800}
              margin={{
                top: 20,
                right: 40,
                bottom: 20,
                left: -20,
              }}
            >
              {/* <CartesianGrid /> */}
              <XAxis type="category" dataKey="x" 
                style={{ fontSize: '0.8rem' }}
                // interval={0} domain={[0, 6]}
                // allowDuplicatedCategory={false}
                // ticks={['*', 'A', 'B', 'C', 'D']}
                // tickCount={5}
                // tickFormatter={renderXAxis}
                tickLine={false}
                axisLine={{stroke: '#C8C9CC', strokeWidth: 1}}
                // axisLine={false}
                // tickLine={{ transform: 'translate(0, -6)' }}
              />
              <YAxis type="number" dataKey="y" 
                tick={false}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis type="number" dataKey="z" range={[0, 200]} domain={[0, 8]} />
              {/* <ZAxis type="number" dataKey="w" zAxisId={1} unit="votes missed" range={[0, 200]} domain={[0, 7]} /> */}
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
              <Area type="monotone" dataKey="s" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
    </Paper>
  );
}