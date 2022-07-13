import * as React from 'react';
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

const COLORS = ['#45CDE9', '#7A8FD3','#FF3D3D'];

const renderTooltip = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    const p = data.payload.total === 0 ? 0 : data.payload.value / data.payload.total
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
        <b>Statements</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          {data.payload.name}: {data.payload.value} ({Math.round(p*100)}%)
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValBackingPieChart({data}) {
  
  const total = data.e + data.i + data.m;
  const pieData = [
    { name: '(✓e) Valid', value: data.e, total },
    { name: '(✓i) Seconded', value: data.i, total },
    { name: '(✗) Missed', value: data.m, total },
  ];

  return (
    <Box
        sx={{
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 200,
          height: '100%',
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <ResponsiveContainer width='100%' height={100} >
            <PieChart width={80} height={100}>
            <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={32}
                innerRadius={2}
                startAngle={90}
                endAngle={-360}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
          <Typography variant="caption">{data.n}</Typography>
    </Box>
  );
}