import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
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
import Divider from '@mui/material/Divider';
import {
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import { isChainSupported, getChainNameShort } from '../constants'
import { stashDisplay, nameDisplay } from '../util/display'
import { ThemeContext } from '@emotion/react';

const codes = ['★', 'A', 'B', 'C', 'D']

function createParachainsData(x, y, a, m, p, z, pid) {
  return { x, y, a, m, p, z, pid };
}

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
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <b>{valIdentities[data.x-1].identity}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        (✓e + ✓i) Accepted: {data.a}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
        (✗) Missed: {data.m}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography component="div" variant="caption" color="inherit">
          <b>Total points: {data.p}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

const renderParachainLabel = (value) => {
  return (
    <g>
      <text style={{fontSize: "0.8rem"}} x={44} y={22} fill="#666" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};


const renderIdentityTick = (identity) => {
  return identity.identity
}

export default function ValGroupParachainsChart({sessionIndex, groupId}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let filtered = validators.filter(v => v.address !== selectedAddress)
  filtered.splice(0,0,validators.find(v => v.address === selectedAddress));
  
  const currentParaId = validators[0].para.pid;
  const paraIds = Object.keys(validators[0].para_stats);
  const data = paraIds.map((p, i) => {
    console.log(p);
    return filtered.map((v, j) => {
      if (v.para_stats[p]) {
        const total = v.para_stats[p].ev + v.para_stats[p].iv + v.para_stats[p].mv
        return createParachainsData(j+1, 1, v.para_stats[p].ev + v.para_stats[p].iv, v.para_stats[p].mv, v.para_stats[p].pt, total, parseInt(p))
      }
      return createParachainsData(j+1, 1, 0, 0, 0, 0, 0)
    })
  })
  
  const identities = filtered.map((v, i) => ({
    code: codes[i],
    identity: nameDisplay(!!v.identity ? v.identity : stashDisplay(v.address, 3), 10, selectedAddress === v.address ? '★ ' : '')
  }))

  const maxRange = Math.max(...data.map(o => o[0].a + o[0].m))
  
  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: (60 * data.length) + 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Parachains breakdown</Typography>
          </Box>
        </Box>
        {data.map((d, i) => {
          return (
          <ResponsiveContainer key={i} width="100%" height={60}>
            <ScatterChart
              // width={500}
              height={60}
              margin={{
                top: 20,
                right: 10,
                bottom: -10,
                left: 10,
              }}
              style={{
                borderRadius: '24px',
                margin: '10px',
                backgroundColor: d[0].pid === currentParaId ? theme.palette.neutrals[100] : 'transparent'
              }}
            >
              {i === data.length - 1 ? 
                <XAxis type="category" dataKey="x"
                  allowDuplicatedCategory={false}
                  axisLine={{stroke: theme.palette.divider, strokeWidth: 1}}
                  interval={0}
                  tick={{ fontSize: '0.8rem' }}
                  tickLine={{ transform: 'translate(0, -6)' }}
                  tickFormatter={(v, i) => renderIdentityTick(identities[i])}
                /> : 
                <XAxis type="category" dataKey="x"
                  allowDuplicatedCategory={false}
                  axisLine={{stroke: theme.palette.divider, strokeWidth: 1}}
                  interval={0}
                  tick={{ fontSize: 0 }}
                  tickLine={{ transform: 'translate(0, -6)' }}
                />
              }
              <YAxis type="number" dataKey="y" 
                tick={false}
                tickLine={false}
                axisLine={false}
                label={() => renderParachainLabel(isChainSupported(selectedChain, paraIds[i]) ? getChainNameShort(selectedChain, paraIds[i]) : paraIds[i])}
              />
              <ZAxis type="number" dataKey="z" range={[0, 200]} domain={[0, maxRange]} />
              {/* <ZAxis type="number" dataKey="w" zAxisId={1} unit="votes missed" range={[0, 200]} domain={[0, 7]} /> */}
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                wrapperStyle={{ zIndex: 100 }} 
                content={(props) => renderTooltip(props, identities)} />
                  <Scatter data={d}>
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
        )})}
    </Paper>
  );
}