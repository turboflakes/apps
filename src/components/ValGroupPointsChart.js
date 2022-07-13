import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

const renderTooltip = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    // const p = data.payload.total === 0 ? 0 : data.payload.value / data.payload.total
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
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
        <b>{data.n}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          Total points: {data.p}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function PointsByParachainsChart({data}) {
  
  return (
    <Paper sx={{ p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 300,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Points</Typography>
          {/* <Typography variant="subtitle2">(+4%) than previous session</Typography> */}
        </Box>
      </Box>
      <ResponsiveContainer width="100%" >
        <BarChart
          // width={500}
          // height={400}
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="1 3" vertical={false} />
          <XAxis style={{ fontSize: '0.8rem' }} axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} type="number" />
          
          <YAxis style={{ fontSize: '0.8rem' }} dataKey="n" type="category" axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} />
          {/* <Tooltip /> */}
          <Bar dataKey="p" fill="#45CDE9" barSize={8} />
          {/* <Bar dataKey="p" barSize={8} background={{ fill: '#eee' }}>
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`}  fill={'#fff'} stroke={'#8884d8'} strokeWidth={index === 2 ? 4 : 1} />
              ))
            }
          </Bar> */}
          <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}