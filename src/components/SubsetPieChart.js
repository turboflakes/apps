import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

const COLORS = (theme) => ({
  "NONVAL": theme.palette.semantics.red,
  "Non-validator": theme.palette.semantics.red,
  "C100": theme.palette.grey[900],
  "NONTVP": theme.palette.grey[200],
  "Others": theme.palette.grey[200],
  "TVP": theme.palette.semantics.blue
})

const renderTooltip = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          minWidth: '192px',
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
         }}
      >
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <b>{data.payload.name} {data.payload.name !== "Non-validator" ? "validators" : ""}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        <span style={{ marginRight: '8px', color: data.fill }}>●</span>{data.payload.value} {data.payload.name === "Non-validator" ? "addresses" : "validators"} ({`${Math.round((data.payload.value / data.payload.total)*100)}%`})
        </Typography>
      </Box>
    );
  }

  return null;
};

const renderLegend = (props) => {
  return (
    <Box sx={{mt: 1, display: 'flex', flexDirection: 'column'}}>
      {props.payload.map((o, i) => (
        <Typography key={i} variant="caption" gutterBottom>
          <span style={{ marginRight: '8px', color: o.color }}>●</span>{o.payload.name}: {o.payload.value} 
        </Typography>
      ))}
    </Box>
  );
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
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

export default function SubsetPieChart({data, size, showLegend, showLabel}) {
  const theme = useTheme();
  const total = data.map(d => d.value).reduce((a, b) => a + b, 0);
  const pieData = data.map(d => {
    return {
      name: d.subset,
      value: d.value,
      total,
    }
  });

  return (
    <Box
        sx={{
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: ["md", "sm"].includes(size) ? '100%' : 64,
          // height: 216,
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <ResponsiveContainer width='100%' height={size === "md" ? 256 : (size === "sm" ? 180 : 64)} >
            <PieChart>
            <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 72 : (size === "sm" ? 56 : 32)}
                innerRadius={2}
                startAngle={90}
                endAngle={-360}
                label={showLabel ? renderCustomizedLabel : null}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS(theme)[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
                {showLegend ? <Legend verticalAlign="top" content={renderLegend} height={56} /> : null}
            </PieChart>
          </ResponsiveContainer>
    </Box>
  );
}