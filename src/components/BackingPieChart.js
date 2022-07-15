import * as React from 'react';
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import {nameDisplay} from '../util/display';

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!percent) {
    return null
  }
  return (
    <text x={x} y={y} style={{fontSize: "0.8rem"}} fill={COLORS[index]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function BackingPieChart({data, showLegend, size}) {
  
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
          width: size === "md" ? 210 : 160,
          // height: '100%',
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <ResponsiveContainer width='100%' height={size === "md" ? 180 : 100} >
            <PieChart>
            <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 56 : 32}
                innerRadius={2}
                startAngle={90}
                endAngle={-360}
                label={renderCustomizedLabel}
                labelLine={false}
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
          {showLegend ? <Typography sx={{ mt: 2}} variant="caption">{nameDisplay(data.n, 15)}</Typography> : null}
    </Box>
  );
}