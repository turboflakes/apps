import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/PlaylistAdd';
import ValidatorsHistoryDataGrid from './ValidatorsHistoryDataGrid';
import IdentityFilter from './IdentityFilter';
import Spinner from './Spinner';
import SessionSliderRange from './SessionSliderRange';
import { 
  useGetSessionsQuery, 
  sessionHistoryIdsChanged,
  selectSessionHistoryIds,
  buildSessionIdsArrayHelper
} from '../features/api/sessionsSlice'
import {
  useGetValidatorsQuery,
} from '../features/api/validatorsSlice'


export default function ValidatorsHistoryInsights({skip}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const historySessionIds = useSelector(selectSessionHistoryIds);
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
        <Box sx={{ mb: 2 }}>
          <Box style={{ mb: 1, display: "flex", alignItems: "center", justifyContent: 'space-between'}} >
            <Box sx={{ mr: 1 }}>
              <Button variant='contained' 
                endIcon={isFetching ? <Spinner size={24}/> : <AddIcon />} 
                sx={{minWidth: 200}}
                onClick={handleLoadTimeline}
                disabled={isFetching} disableRipple>
                Load sessions
              </Button>
            </Box>
            <SessionSliderRange />
          </Box>
        </Box>
        <IdentityFilter />
        <ValidatorsHistoryDataGrid isFetching={isFetching} />
    </Paper>
  );
}