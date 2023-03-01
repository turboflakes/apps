import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/PlaylistAdd';
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
  const {isFetching: isFetchingValidators} = useGetValidatorsQuery({role: "authority", from: historySessionIds[0], to: historySessionIds[5], show_summary: true, show_profile: true}, {skip});
  const {isFetching: isFetchingSessions } = useGetSessionsQuery({from: historySessionIds[0], to: historySessionIds[5], show_stats: true}, {skip});

  const isFetching = isFetchingValidators || isFetchingSessions;

  const handleLoadTimeline = (event) => {
    const newIds = buildSessionIdsArrayHelper(historySessionIds[0] - 1, 6);
    dispatch(sessionHistoryIdsChanged([...newIds, ...historySessionIds]))
  }

  return (
    <Box
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
      >
      <Box sx={{ my: 1, display: "flex", alignItems: "center", justifyContent: 'space-between'}} >
        <SessionSliderRange isFetching={isFetching} />
        <Box sx={{ mx: 1 }}>
          <Button variant='contained' 
            endIcon={isFetching ? <Spinner size={24}/> : <AddIcon />} 
            sx={{minWidth: 128, mt: -3}}
            onClick={handleLoadTimeline}
            disabled={isFetching} disableRipple>
            Load
          </Button>
        </Box>
      </Box>
    </Box>
  );
}