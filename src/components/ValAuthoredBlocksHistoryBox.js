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
  selectAuthoredBlocksBySessions,
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
          minWidth: '272px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>Authored Blocks</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <i>{data.avgQty} sessions</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>{data.name} (avg. {data.valueQty}x): <b>{data.value}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>All Authorities (avg. {data.avgQty}x): <b>{data.avg}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValAuthoredBlocksHistoryBox({address, maxSessions}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true});
  const {isSuccess} = useGetValidatorsQuery({address: address, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true });
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  const allAuthoredBlocks = useSelector(state => selectAuthoredBlocksBySessions(state, historySessionIds));
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));

  if (!isSuccess || !isSessionSuccess) {
    return null
  }

  const filtered = validators.filter(v => v.is_auth);

  if (!filtered.length) {
    return null
  }


  const authoredBlocksTotal = filtered.map(v => v.auth.ab.length).reduce((a, b) => a + b, 0);
  const authoredBlocks = Math.round((authoredBlocksTotal / filtered.length) * 100) / 100;
  
  const avg = !!allAuthoredBlocks.length ? Math.round((allAuthoredBlocks.reduce((a, b) => a + b, 0) / (allAuthoredBlocks.length * 1000)) * 100) / 100 : 0;
  const diff = !!avg ? Math.round(((authoredBlocks * 100 / avg) - 100) * 10) / 10 : 0;
  
  const data = [
    {name: nameDisplay(valProfile._identity, 12), value: authoredBlocks, valueQty: filtered.length, avg, avgQty: allAuthoredBlocks.length},
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
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', maxWidth: '128px'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Authored Blocks</Typography>
        <Typography variant="h5">
          {!isUndefined(authoredBlocksTotal) ? authoredBlocksTotal : '-'}
        </Typography>
        <Tooltip title={`${Math.abs(diff)}% ${Math.sign(diff) > 0 ? 'more' : 'less'} than the average of Authored Blocks per session of all the Authorities of the last ${allAuthoredBlocks.length} sessions.`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', 
            lineHeight: 0.875,
            color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}>
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
                offset={48}
                wrapperStyle={{ zIndex: 100 }}
                content={props => renderTooltip(props, theme)} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}