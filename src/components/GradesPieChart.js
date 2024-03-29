import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import {
  selectChain,
} from '../features/chain/chainSlice';
import { getNetworkIcon } from '../constants'

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
          minWidth: '192px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <b>Grade {data.payload.name}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        <span style={{ marginRight: '8px', color: data.fill }}>●</span>{data.payload.quantity} validators ({Math.round(data.payload.value*100)/100}%)
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function GradesPieChart({data, size, dark, showNetworkIcon}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
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
            {showNetworkIcon ? 
              <Box sx={{
                position: 'absolute',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                bgcolor: '#fff',
                width: 254,
                height: 254,
                borderRadius: "50%", 
                boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                }}>
                <img src={getNetworkIcon(selectedChain)}  style={{ 
                      width: 80,
                      height: 80 }} alt={selectedChain}/>
              </Box> : null}
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
                  <Cell key={`cell-${index}`} fill={theme.palette.grade[entry.name]} borderRadius 
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