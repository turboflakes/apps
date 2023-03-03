import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

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
          minWidth: '144px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          <b>State {data.payload.name}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          {Math.round(data.payload.value*100)/100}%
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          {data.payload.quantity} pools
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function PoolsStatesPieChart({data, size, dark, showNetworkIcon}) {
  const theme = useTheme();
  return (
    <Box
        sx={{
          // p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: size === "lg" ? 288 : (size === "md" ? 208 : 64),
          // height: '100%',
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            <PieChart width={size === "lg" ? 272 : (size === "md" ? 208 : 64)} height={ size === "lg" ? 272 : (size === "md" ? 272 : 64)}>
            <Pie
                isAnimationActive={false}
                dataKey="value"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={size === "lg" ? 128 : (size === "md" ? 96 : 32)}
                innerRadius={size === "lg" ? 96 : (size === "md" ? 64 : 20)}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.palette.state[entry.name]} borderRadius 
                  stroke={dark ? theme.palette.background.secondary : theme.palette.background.paper} strokeWidth={1} />
                ))}
              </Pie>
              {!showNetworkIcon ?
                (size === "md" ?
                  <text x="50%" y="50%" fill={dark ? theme.palette.text.secondary : '#343434'} style={{ 
                    fontFamily: theme.typography.h2.fontFamily,
                    fontSize: theme.typography.h2.fontSize,
                    color: dark ? theme.palette.text.secondary : 'default'
                    }} textAnchor={'middle'} dominantBaseline="central">
                    {data.slice().sort((a, b) => b.value - a.value)[0].name}
                  </text> : 
                  <text x="50%" y="50%" fill={dark ? theme.palette.text.secondary : '#343434'} style={{ 
                    fontFamily: theme.typography.caption.fontFamily,
                    fontSize: theme.typography.caption.fontSize,
                    fontWeight: 'bold'
                    }} textAnchor={'middle'} dominantBaseline="central">
                    {`${Math.floor(data.slice().sort((a, b) => b.value - a.value)[0].value)}%`}
                  </text>) : null
              }
              {!showNetworkIcon ? 
                (size === "md" ?
                  <text x="50%" y="58%" fill={dark ? theme.palette.text.secondary : '#343434'} style={{ 
                    fontFamily: theme.typography.caption.fontFamily,
                    fontSize: theme.typography.caption.fontSize,
                    color: dark ? theme.palette.text.secondary : 'default'
                    }} textAnchor={'middle'} dominantBaseline="central">
                    majority
                  </text> :  null) : null
              }
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
            </PieChart>
        </Box>
    </Box>
  );
}