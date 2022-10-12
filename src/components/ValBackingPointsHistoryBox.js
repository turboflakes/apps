import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { BarChart, Bar, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import {
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  useGetSessionsQuery,
  selectBackingPointsBySessions,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress,
} from '../features/api/valProfilesSlice';
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
          minWidth: '296px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>Backing Points (avg.)</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <i>{data.avgQty} sessions</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>{data.name} (avg. {data.valueQty}x): <b>{data.value}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>All Para-Authorities (avg. {data.avgQty}x): <b>{data.avg}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValBackingPointsHistoryBox({address, maxSessions}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true});
  const {isSuccess} = useGetValidatorsQuery({address: address, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true });
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  const allBackingPoints = useSelector(state => selectBackingPointsBySessions(state, historySessionIds));
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));

  if (!isSuccess || !isSessionSuccess) {
    return null
  }

  const filtered = validators.filter(v => v.is_auth && v.is_para);

  if (!filtered.length) {
    return null
  }

  const backingPoints = Math.round(filtered.map(v => ((v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20)) > 0 ? (v.auth.ep - v.auth.sp) - (v.auth.ab.length * 20) : 0).reduce((a, b) => a + b, 0) / filtered.length);
  
  // TODO get the total para-authorities per session from backend
  const avg = !!allBackingPoints.length ? Math.round(allBackingPoints.reduce((a, b) => a + b, 0) / (allBackingPoints.length * 200)) : 0;
  const diff = !!avg ? Math.round(((backingPoints * 100 / avg) - 100) * 10) / 10 : 0;
  
  const data = [
    {name: nameDisplay(valProfile._identity, 12), value: backingPoints, valueQty: filtered.length, avg, avgQty: allBackingPoints.length},
  ];
  
  return (
    <Paper 
      sx={{
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
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', maxWidth: '112px'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Backing Points (avg.)</Typography>
        <Typography variant="h5">
          {!isUndefined(backingPoints) ? backingPoints : '-'}
        </Typography>
        <Tooltip title={`${Math.abs(diff)}% ${Math.sign(diff) > 0 ? 'more' : 'less'} than the average of Backing Points collected by all Para-Authorities of the last ${allBackingPoints.length} sessions.`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', 
            lineHeight: 0.875,
            color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}>
            <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${diff}%` : `-${Math.abs(diff)}%`) : ' '}</b>
          </Typography>
        </Tooltip>
      </Box>
      <ResponsiveContainer height='100%'  sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <BarChart data={data}
        width='100%'
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