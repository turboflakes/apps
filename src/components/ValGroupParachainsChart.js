import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  selectChain
} from '../features/chain/chainSlice';
import { isChainSupported, getChainNameShort } from '../constants'

const renderTooltip = (props, valIdentities) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          // color: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}

      >
        <Typography component="div" variant="caption" color="inherit" gutterBottom>
          <b>{valIdentities[data.x-1].identity}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        (✓e + ✓i) Accepted: {data.a}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        (✗) Missed: {data.m}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        Total points: {data.p}
        </Typography>
      </Box>
    );
  }

  return null;
};

const renderParachainLabel = (value) => {
  return (
    <g>
      <text style={{fontSize: "0.8rem"}} x={40} y={10} fill="#666" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};


const renderIdentityTick = (identity) => {
  return identity.code
}

export default function ValGroupParachainsChart({data, ids, identities}) {
  const selectedChain = useSelector(selectChain);
  const maxRange = Math.max(...data.map(o => o[0].a + o[0].m))
  
  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: (60 * data.length) + 90,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Parachains breakdown</Typography>
          </Box>
        </Box>
        {data.map((d, i) => (
          <ResponsiveContainer key={i} width="100%" height={60}>
            <ScatterChart
              // width={500}
              height={60}
              margin={{
                top: 10,
                right: 10,
                bottom: 0,
                left: 10,
              }}
            >
              {i === data.length - 1 ? 
                <XAxis type="category" dataKey="x"
                  allowDuplicatedCategory={false}
                  axisLine={{stroke: '#C8C9CC', strokeWidth: 1}}
                  interval={0}
                  tick={{ fontSize: '0.8rem' }}
                  tickLine={{ transform: 'translate(0, -6)' }}
                  tickFormatter={(v, i) => renderIdentityTick(identities[i])}
                /> : 
                <XAxis type="category" dataKey="x"
                  allowDuplicatedCategory={false}
                  axisLine={{stroke: '#C8C9CC', strokeWidth: 1}}
                  interval={0}
                  tick={{ fontSize: 0 }}
                  tickLine={{ transform: 'translate(0, -6)' }}
                />
              }
              <YAxis type="number" dataKey="y" 
                tick={false}
                tickLine={false}
                axisLine={false}
                label={() => renderParachainLabel(isChainSupported(selectedChain, ids[i]) ? getChainNameShort(selectedChain, ids[i]) : ids[i])}
              />
              <ZAxis type="number" dataKey="z" range={[0, 200]} domain={[0, maxRange]} />
              {/* <ZAxis type="number" dataKey="w" zAxisId={1} unit="votes missed" range={[0, 200]} domain={[0, 7]} /> */}
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                wrapperStyle={{ zIndex: 100 }} 
                content={(props) => renderTooltip(props, identities)} />
                  <Scatter data={d} >
                  {
                      d.map((entry, index) => {
                        // green to red
                        // const ratio = (entry.a + entry.m === 0 ? 0 : entry.a / (entry.a + entry.m))
                        // const fill=`hsl(${ratio * 120}, 85%, 52%)`
                        // grey to red
                        const ratio = (entry.a + entry.m === 0 ? 0 : entry.m / (entry.a + entry.m))
                        const fill=`hsl(360, ${ratio * 100}%, 62%)`
                        return (
                          <Cell key={`cell-${index}`} fill={fill} />
                      )})
                    }
                  </Scatter> 
            </ScatterChart>
          </ResponsiveContainer>
        ))}
    </Paper>
  );
}