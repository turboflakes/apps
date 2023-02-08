import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValidatorsInsights from './ValidatorsInsights';
import ValidatorsHistoryInsights from './ValidatorsHistoryInsights';
import SubsetBox from './SubsetBox';
import SubsetFilter from './SubsetFilter';

import GradesWithFilterBox from './GradesWithFilterBox';

import {
  selectAddress,
  addressChanged
} from '../features/chain/chainSlice';
import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice';
import { 
  selectIsLiveMode,
  selectIsHistoryMode
} from '../features/layout/layoutSlice';
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice';

export default function InsightsGrid() {
	// const theme = useTheme();
  const { stash } = useParams();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  
  React.useEffect(() => {
    if (stash && stash !== selectedAddress) {
      dispatch(addressChanged(stash));
    }
  }, [stash, selectedAddress]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Validator Insights</Typography>
          <Typography variant="subtitle" color="secondary">
          Active validators in the current session {sessionIndex.format()}
          </Typography>
        </Box>
        <SubsetFilter />
      </Box>
      <Grid container spacing={2}>
        {isLiveMode ? 
          <Grid item xs={10}>
            <ValidatorsInsights sessionIndex={sessionIndex} skip={isNaN(sessionIndex)} />
          </Grid> : null}
        {isHistoryMode ? 
          <Grid item xs={10}>
            <ValidatorsHistoryInsights skip={isNaN(sessionIndex)} />
          </Grid> : null}
          <Grid item xs={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <GradesWithFilterBox sessionIndex={sessionIndex} isHistoryMode={isHistoryMode}/>
              </Grid>
              <Grid item xs={12}>
                <SubsetBox sessionIndex={sessionIndex} isHistoryMode={isHistoryMode}/>
              </Grid>
            </Grid>            
          </Grid> 
      </Grid>
		</Box>
  );
}