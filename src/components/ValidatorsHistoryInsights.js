import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/PlaylistAdd';
import ValidatorsHistoryDataGrid from './ValidatorsHistoryDataGrid';
import IdentityFilter from './IdentityFilter';
import SubsetFilter from './SubsetFilter';
import Spinner from './Spinner';
import { 
  useGetSessionsQuery, 
  sessionHistoryIdsChanged,
  selectSessionHistoryIds,
  selectSessionHistoryRange,
  buildSessionIdsArrayHelper
} from '../features/api/sessionsSlice'
import {
  useGetValidatorsQuery,
} from '../features/api/validatorsSlice'


export default function ValidatorsHistoryInsights({skip}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const historySessionIds = useSelector(selectSessionHistoryIds);
  const historySessionRange = useSelector(selectSessionHistoryRange);
  const {isFetching: isFetchingValidators} = useGetValidatorsQuery({sessions: [historySessionIds[0], historySessionIds[5]].join(","), show_summary: true, show_profile: true}, {skip});
  const {isFetching: isFetchingSessions } = useGetSessionsQuery({from: historySessionIds[0], to: historySessionIds[5], show_stats: true}, {skip});

  const isFetching = isFetchingValidators || isFetchingSessions;

  const handleLoadTimeline = (event) => {
    const newIds = buildSessionIdsArrayHelper(historySessionIds[0] - 1, 6);
    dispatch(sessionHistoryIdsChanged([...newIds, ...historySessionIds]))
  }

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '1144px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6">Validators</Typography>
            <Typography variant="subtitle2">Active validators between session {historySessionRange[0].format()} and session {historySessionRange[1].format()} ({historySessionRange[1] - historySessionRange[0] + 1} sessions) </Typography>
          </Box>
          <Box>
          {isFetching ? <Spinner /> : null}
          </Box>
        </Box>

        <Box style={{ display: "flex", alignItems: "center", justifyContent: 'space-between'}} >
          <Box>
            <IdentityFilter />
            <SubsetFilter />
          </Box>
          <Button variant='contained' endIcon={<AddIcon />} onClick={handleLoadTimeline} small
            disabled={isFetching} disableRipple>
            Load more sessions
          </Button>
        </Box>
        <ValidatorsHistoryDataGrid isFetching={isFetching} />
    </Paper>
  );
}