import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import SessionPieChart from './SessionPieChart';
import BlockBox from './BlockBox';
import ValGroupBox from './ValGroupBox';
import ValAddressProfile from './ValAddressProfile';
import ValMvrBox from './ValMvrBox';
import ValPointsBox from './ValPointsBox';
import ValAuthoredBlocksBox from './ValAuthoredBlocksBox';
import SearchSmall from './SearchSmall';
import ValidatorSessionHistoryPointsChart from './ValidatorSessionHistoryPointsChart';
import {
  selectChain,
  selectAddress,
  addressChanged
} from '../features/chain/chainSlice';
import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice';
import { 
  selectIsLiveMode,
  selectIsHistoryMode,
} from '../features/layout/layoutSlice';
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice';
import { getMaxHistorySessions } from '../constants';


export default function ValHeaderBox({address}) {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const selectedChain = useSelector(selectChain);
  const maxSessions = getMaxHistorySessions(selectedChain);
  let [searchParams] = useSearchParams();
  const searchAddress = searchParams.get("address");
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ 
        // p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      {/* <Box>
        <Typography variant="h4">Validator Performance History</Typography>
        <Typography variant="subtitle" paragraph>Stats from the previous {maxSessions} sessions</Typography>
      </Box> */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex'}}>
            <ValAddressProfile address={address} maxSessions={maxSessions} showGrade />
          </Box>
        </Grid>
        <Grid item xs={12} md={2}>
          <ValMvrBox address={address} maxSessions={maxSessions} />
        </Grid>
        <Grid item xs={12} md={2}>
          <ValPointsBox address={address} maxSessions={maxSessions} />
        </Grid>
        <Grid item xs={12} md={2}>
          <ValAuthoredBlocksBox address={address} maxSessions={maxSessions} />
        </Grid>
        <Grid item xs={6}>
          <ValidatorSessionHistoryPointsChart address={selectedAddress} maxSessions={maxSessions} />
        </Grid>
      </Grid>
		</Box>
  );
}