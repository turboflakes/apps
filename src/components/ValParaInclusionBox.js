import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  useGetSessionsQuery,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';

export default function ValParaInclusionBox({address, maxSessions}) {
  // const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true});
  const {isSuccess} = useGetValidatorsQuery({address: address, number_last_sessions: maxSessions, show_summary: true, show_stats: false, fetch_peers: true });
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  
  if (!isSuccess || !isSessionSuccess) {
    return null
  }

  const nAuth = validators.filter(v => v.is_auth).length;
  const nPara = validators.filter(v => v.is_auth && v.is_para).length;
  const paraInclusion = nAuth > 0 ? Math.round((nPara / nAuth) * 100) : 0;

  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Para-Authority Inclusion</Typography>
        <Typography variant="h5">
          {!isUndefined(paraInclusion) ? `${paraInclusion}%` : '-'}
        </Typography>
        <Tooltip title={`${nPara} para-authority sessions out of ${nAuth} authority sessions.`} arrow>
          <Typography variant="subtitle2" sx={{
            lineHeight: 0.875,
            whiteSpace: 'nowrap'
            }}>
            <b style={{whiteSpace: 'pre'}}>{`${nPara} / ${nAuth}`}</b>
          </Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}