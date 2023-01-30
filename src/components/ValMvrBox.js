import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { BarChart, Bar, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
import {
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import {
  selectMVRsBySession,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress,
} from '../features/api/valProfilesSlice';
import { calculateMvr } from '../util/mvr'
import { nameDisplay } from '../util/display'

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
          minWidth: '280px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>Missed Vote Ratio</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <i>Session {data.session.format()}</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>{data.name}: <b>{data.value}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>All Para-Authorities: <b>{data.avg}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValMvrBox({address}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {isFetching} = useGetValidatorsQuery({session: currentSession, role: "para_authority", show_summary: true});
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, currentSession, address));
  const allMvrs = useSelector(state => selectMVRsBySession(state, currentSession));
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  
  if (isFetching || isUndefined(validator) || isUndefined(valProfile)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

  if (!validator.is_para) {
    return null
  }

  const mvr = Math.round(calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv) * 10000) / 10000;
  const avg = Math.round((!!allMvrs.length ? allMvrs.reduce((a, b) => a + b, 0) / allMvrs.length : 0) * 10000) / 10000;
  const diff = !!avg && !!mvr ? Math.round(((mvr * 100 / avg) - 100) * 10) / 10 : 0;
  
  const data = [
    {name: nameDisplay(valProfile._identity, 12), value: mvr, avg, session: currentSession},
  ];
  
  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>missed vote ratio</Typography>
        <Typography variant="h5">
          {!isUndefined(mvr) ? Math.round(mvr * 10000) / 10000 : '-'}
        </Typography>
        <Tooltip title={diff === 0 ? 'Exceptional run. The validator participate in all votes.'  : `${Math.abs(diff)}% ${Math.sign(diff) > 0 ? 'more' : 'less'} than the average of MVR of all Para-Authorities in the current session.`} arrow>
          <Typography variant="subtitle2" sx={{
            lineHeight: 0.875,
            whiteSpace: 'nowrap', color: Math.sign(diff) > 0 ? theme.palette.semantics.red : theme.palette.semantics.green
            }}>
            <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${diff}%` : `-${Math.abs(diff)}%`) : ' '}</b>
          </Typography>
        </Tooltip>
      </Box>
      <ResponsiveContainer height='100%' sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <BarChart data={data}
          margin={{
            top: 4,
            right: 0,
            left: 0,
            bottom: 4,
          }}>
          <Bar dataKey="value" barSize={12} fill={theme.palette.text.primary} />
          <Bar dataKey="avg" barSize={12} fill={theme.palette.grey[200]} />
          <ChartTooltip 
                cursor={{fill: 'transparent'}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}