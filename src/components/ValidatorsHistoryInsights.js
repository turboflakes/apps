import * as React from 'react';
import { useSelector } from 'react-redux'
import Paper from '@mui/material/Paper';
import ValidatorsHistoryDataGrid from './ValidatorsHistoryDataGrid';
import { 
  useGetSessionsQuery, 
  selectSessionHistoryIds,
} from '../features/api/sessionsSlice'
import {
  useGetValidatorsQuery,
} from '../features/api/validatorsSlice'


export default function ValidatorsHistoryInsights({skip}) {
  // const theme = useTheme();
  const historySessionIds = useSelector(selectSessionHistoryIds);
  const {isFetching: isFetchingValidators} = useGetValidatorsQuery({role: "authority", from: historySessionIds[0], to: historySessionIds[5], show_summary: true, show_profile: true}, {skip});
  const {isFetching: isFetchingSessions } = useGetSessionsQuery({from: historySessionIds[0], to: historySessionIds[5], show_stats: true}, {skip});

  const isFetching = isFetchingValidators || isFetchingSessions;

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '1072px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <ValidatorsHistoryDataGrid isFetching={isFetching} />
    </Paper>
  );
}