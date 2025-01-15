import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import orderBy from 'lodash/orderBy';
import Box from '@mui/material/Box';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import { versionToNumber, versionNumberToHex } from '../util/display';

const COLORS_B = (theme) => ([theme.palette.grey[400], '#F26522'])
const COLORS_A = (theme) => ([theme.palette.grey[300], theme.palette.grey[200],'#FF3D3D'])

const renderTooltip = (props) => {
  const { active, payload, color } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    const p = data.payload.total === 0 ? 0 : data.payload.value / data.payload.total
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          minWidth: '208px',
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" paragraph>
        <b>{data.payload.name}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: data.fill }}>●</span>{data.payload.label} ({Math.round(p*100)}%)
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
    <text x={x} y={y} style={{fontSize: "0.8rem"}} fill={COLORS_A[index]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function LevelsPieChart({dataL1, dataL2, dataL3, dataL4, showLegend, showIdentity, dark, size}) {
  const theme = useTheme();
  const pieL4 = [
    { name: 'Explicit Votes', value: dataL4.e, total: dataL4.e + dataL4.i + dataL4.m, icon: '✓e', label: `${dataL4.e} votes` },
    { name: 'Implicit Votes', value: dataL4.i, total: dataL4.e + dataL4.i + dataL4.m, icon: '✓i', label: `${dataL4.i} votes` },
    { name: 'Missed Votes', value: dataL4.m, total: dataL4.e + dataL4.i + dataL4.m, icon: '✗v', label: `${dataL4.m} votes` },
  ];
  const pieL3 = [
    { name: 'Bitfields Available', value: dataL3.a, total: dataL3.a + dataL3.u, icon: '✓b', label: `${dataL3.a} blocks` },
    { name: 'Bitfields Unavailable', value: dataL3.u, total: dataL3.a + dataL3.u, icon: '✗b', label: `${dataL3.b} blocks` },
  ];
  const totalL2 = Object.values(dataL2).reduce((acc, value) => acc + value, 0);
  const pieL2 = orderBy(Object.keys(dataL2).map(k => ({ name: k !== '' ? `Version ${k}` : `Version Unavailable`, value: dataL2[k], total: totalL2, label: `${dataL2[k]} validators`, n: versionToNumber(k)  })), 'n');

  const totalL1 = Object.values(dataL1).reduce((acc, value) => acc + value, 0);
  const pieL1 = Object.keys(dataL1).map(k => ({ name: k !== '-' ? `Grade ${k}` : `N/D`, value: dataL1[k], total: totalL1, label: `${dataL1[k]} validators`, n: k  }));
  
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
                data={pieL1}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 28 : 22}
                innerRadius={size === "md" ? 12 : 8}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                 {pieL1.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={theme.palette.grade[entry.n]} borderRadius 
                    stroke={dark ? theme.palette.background.secondary : theme.palette.background.paper} strokeWidth={1} />
                  ))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieL2}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 48 : 32}
                innerRadius={size === "md" ? 32 : 16}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieL2.map((entry, index) => (<Cell key={`cell-${index}`} fill={versionNumberToHex(entry.n)} />))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieL3}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 68 : 52}
                innerRadius={size === "md" ? 52 : 36}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieL3.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_B(theme)[index]} />
                ))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieL4}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 88 : 72}
                innerRadius={size === "md" ? 72 : 56}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieL4.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_A(theme)[index]} />
                ))}
              </Pie>
              <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={renderTooltip} />
                {showLegend ? <Legend verticalAlign="top" content={renderLegend} height={84} /> : null}
            </PieChart>
          </ResponsiveContainer>
          {/* {showIdentity ? <Typography sx={{ mt: 2}} variant="caption">{nameDisplay(data.n, 16)}</Typography> : null} */}
    </Box>
  );
}