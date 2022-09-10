import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
          <b>Grade</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          {data.payload.name}: {data.payload.value}%
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
          width: size === "md" ? '304px' : '160px',
          // height: '100%',
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <ResponsiveContainer width='100%'  >
            <PieChart>
            <Pie
                isAnimationActive={false}
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 96 : 32}
                innerRadius={64}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.palette.grade[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
    </Box>
  );
}