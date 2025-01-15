import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import orderBy from 'lodash/orderBy';
import Box from '@mui/material/Box';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';
import { versionToNumber, versionNumberToHex } from '../util/display';

const COLORS_A = (theme) => ([theme.palette.grey[400], '#F26522'])
const COLORS_B = (theme) => ([theme.palette.grey[300], theme.palette.grey[200],'#FF3D3D'])

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

export default function LevelsPieChart({dataA, dataB, dataC, dataD, showLegend, showIdentity, dark, size}) {
  const theme = useTheme();
  const pieDataA = [
    { name: 'Bitfields Available', value: dataA.a, total: dataA.a + dataA.u, icon: '✓b', label: `${dataA.a} blocks` },
    { name: 'Bitfields Unavailable', value: dataA.u, total: dataA.a + dataA.u, icon: '✗b', label: `${dataA.b} blocks` },
  ];
  const pieDataB = [
    { name: 'Explicit Votes', value: dataB.e, total: dataB.e + dataB.i + dataB.m, icon: '✓e', label: `${dataB.e} votes` },
    { name: 'Implicit Votes', value: dataB.i, total: dataB.e + dataB.i + dataB.m, icon: '✓i', label: `${dataB.i} votes` },
    { name: 'Missed Votes', value: dataB.m, total: dataB.e + dataB.i + dataB.m, icon: '✗v', label: `${dataB.m} votes` },
  ];
  const totalC = Object.values(dataC).reduce((acc, value) => acc + value, 0);
  const pieDataC = orderBy(Object.keys(dataC).map(k => ({ name: k !== '' ? `Version ${k}` : `N/D`, value: dataC[k], total: totalC, label: `${dataC[k]} validators`, n: versionToNumber(k)  })), 'n');
  const totalD = Object.values(dataD).reduce((acc, value) => acc + value, 0);
  const pieDataD = Object.keys(dataD).map(k => ({ name: k !== '-' ? `Grade ${k}` : `N/D`, value: dataD[k], total: totalD, label: `${dataD[k]} validators`, n: k  }));
  
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
                data={pieDataA}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 28 : 22}
                innerRadius={size === "md" ? 12 : 8}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieDataA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_A(theme)[index]} />
                ))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieDataB}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 48 : 32}
                innerRadius={size === "md" ? 32 : 16}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieDataB.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_B(theme)[index]} />
                ))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieDataC}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 68 : 52}
                innerRadius={size === "md" ? 52 : 36}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieDataC.map((entry, index) => (<Cell key={`cell-${index}`} fill={versionNumberToHex(entry.n)} />))}
              </Pie>
              <Pie
                isAnimationActive={false}
                dataKey="value"
                data={pieDataD}
                cx="50%"
                cy="50%"
                outerRadius={size === "md" ? 88 : 72}
                innerRadius={size === "md" ? 72 : 56}
                startAngle={90}
                endAngle={-360}
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieDataD.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={theme.palette.grade[entry.n]} borderRadius 
                    stroke={dark ? theme.palette.background.secondary : theme.palette.background.paper} strokeWidth={1} />
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