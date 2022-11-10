import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

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
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
          minWidth: '128px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          <b>Grade {data.payload.name}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          {data.payload.value}%
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          {data.payload.quantity} validators
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function GradesPieChart({data, size}) {
  const theme = useTheme();
  return (
    <Box
        sx={{
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: size === "md" ? '304px' : '64px',
          // height: '100%',
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <ResponsiveContainer width='100%' height={ size === "md" ? '100%' : 64} >
            <PieChart width='100%' height={size === "md" ? '100%' : 64}>
            <Pie
                isAnimationActive={false}
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 96 : 32}
                innerRadius={size === "md" ? 64 : 20}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.palette.grade[entry.name]} />
                ))}
              </Pie>
              {size === "md" ?
                <text x="50%" y="50%" fill="#343434" style={{ 
                  fontFamily: theme.typography.h2.fontFamily,
                  fontSize: theme.typography.h2.fontSize
                  }} textAnchor={'middle'} dominantBaseline="central">
                  {data.slice().sort((a, b) => b.value - a.value)[0].name}
                </text> : 
                <text x="50%" y="50%" fill="#343434" style={{ 
                  fontFamily: theme.typography.caption.fontFamily,
                  fontSize: theme.typography.caption.fontSize,
                  fontWeight: 'bold'
                  }} textAnchor={'middle'} dominantBaseline="central">
                  {`${Math.floor(data.slice().sort((a, b) => b.value - a.value)[0].value)}%`}
                </text>
              }
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
    </Box>
  );
}