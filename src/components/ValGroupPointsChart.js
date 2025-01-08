import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import {
  selectAddress,
  selectChain
} from '../features/chain/chainSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import { gradeByRatios } from '../util/grade'
import { stashDisplay, nameDisplay } from '../util/display'
import { chainAddress } from '../util/crypto';
import { getNetworkSS58Format } from '../constants';
import { calculateMVR, calculateBUR } from '../util/math';

const renderTooltip = (props, theme) => {
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
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography component="div" variant="caption" color="inherit">
          <b>{data.name}</b>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', 
                        bgcolor: theme.palette.grade[data.gradeValue] }}>
            </Box>
            <Typography variant="caption" sx={{ml: 1}}><b>{data.gradeValue}</b></Typography>
          </Box>
        </Box>
        <Typography component="div" variant="caption" color="inherit">
          Backing points: {data.pvPoints}
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          Authored Block points: {data.abPoints}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography component="div" variant="caption" color="inherit">
          <b>Total points: {data.pvPoints + data.abPoints}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValGroupPointsChart({sessionIndex, groupId}) {
  const theme = useTheme();
  const selectedAddress = useSelector(selectAddress);
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));

  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let sorted = validators.sort((a, b) => ((b.auth.ep - b.auth.sp) - (a.auth.ep - a.auth.sp)));

  const data = sorted.map(v => ({
    pvPoints: (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20),
    abPoints: v.auth.ab.length * 20,
    gradeValue: gradeByRatios(calculateMVR(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv), calculateBUR(v.para.bitfields.ba, v.para.bitfields.bu)),
    name: nameDisplay(v.profile?.identity ? v.profile._identity : stashDisplay(chainAddress(v.address, getNetworkSS58Format(selectedChain)), 4), 12, selectedAddress === v.address ? '★ ' : '')
  }))
  
  return (
    <Paper sx={{ p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 300,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Session points</Typography>
          {/* <Typography variant="caption"><i>Points under the current session</i></Typography> */}
          {/* <Typography variant="subtitle2">(+4%) than previous session</Typography> */}
        </Box>
      </Box>
      <ResponsiveContainer width="100%" >
        <BarChart
          // width={500}
          // height={400}
          layout="vertical"
          data={data}
          margin={{
            top: 16,
            right: 32,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="1 4" vertical={true} horizontal={false} />
          <XAxis style={{ fontSize: '0.8rem' }} axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} type="number" />         
          <YAxis style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }} dataKey="name" type="category" width={128}
            axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} />
          <Bar dataKey="abPoints" stackId="points" barSize={12} fill={theme.palette.secondary.main}  />
          {/* <Bar dataKey="pvPoints" stackId="points" barSize={12} fill={theme.palette.neutrals[200]} shape={<Rectangle radius={[0, 8, 8, 0]} />}/> */}
          <Bar dataKey="pvPoints" stackId="points" barSize={12} shape={<Rectangle radius={[0, 8, 8, 0]} />} >
            {
              data.map((entry, index) => (<Cell key={`cell-${index}`}  fill={theme.palette.grade[entry.gradeValue]} />))
            }
          </Bar>
          <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}