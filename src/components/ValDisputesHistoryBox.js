import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  useGetSessionsQuery,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';


export default function ValDisputesHistoryBox({address, maxSessions}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true});
  const {isSuccess} = useGetValidatorsQuery({address: address, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true });
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  
  if (!isSuccess || !isSessionSuccess) {
    return null
  }

  const filtered = validators.filter(v => v.is_auth && v.is_para && !isUndefined(v.para.disputes));

  if (!filtered.length) {
    return null
  }

  const disputesTotal = filtered.map(v => v.para.disputes.length).reduce((a, b) => a + b, 0);
  const lastDispute = filtered[filtered.length - 1];
  
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
        bgcolor: theme.palette.semantics.red,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" color="textSecondary" sx={{whiteSpace: 'nowrap'}}>disputes initiated</Typography>
        <Typography variant="h5" color="textSecondary">
          {!isUndefined(disputesTotal) ? disputesTotal : '-'}
        </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ whiteSpace: 'nowrap' }}>
            last #{lastDispute.para.disputes[lastDispute.para.disputes.length-1][0]}
          </Typography>
      </Box>
    </Paper>
  );
}