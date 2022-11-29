import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import SessionBox from './SessionBox';
import SessionPieChart from './SessionPieChart';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ValGroupBox from './ValGroupBox';
import SearchSmall from './SearchSmall';
import ValHeaderBox from './ValHeaderBox';
import ValBodyBox from './ValBodyBox';
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

export default function ValidatorPage() {
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
		<Box sx={{ m: 2, mt: isLiveMode ? 2 : 12, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <SessionPerformanceTimeline sessionIndex={sessionIndex} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <SessionPerformancePieChart />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <SessionPieChart sessionIndex={sessionIndex} />
          </Grid> : null}
        {isLiveMode ?
          <Grid item xs={12} md={isHistoryMode ? 3 : 4}>
            <SessionBox sessionIndex={sessionIndex} dark={isHistoryMode} />
          </Grid> : null}


        {/* --- validator --- */}
        {isLiveMode ?
          <Grid item xs={12}>
            <Divider sx={{ 
              opacity: 0.25,
              height: '1px',
              borderTop: '0px solid rgba(0, 0, 0, 0.08)',
              borderBottom: 'none',
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
              }} />
          </Grid> : null}

        <Grid item xs={12}>
          <ValHeaderBox address={selectedAddress} sessionIndex={sessionIndex} />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ 
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} />
        </Grid>

        <Grid item xs={12}>
          <ValBodyBox address={selectedAddress} sessionIndex={sessionIndex} />
        </Grid>
        
         {/* --- validator group --- */}

        <Grid item xs={12}>
          {!!selectedAddress ? 
          <Box>
            {/* <Divider sx={{ 
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} /> */}
            {/* <ValGroupBox address={selectedAddress} sessionIndex={sessionIndex} /> */}
          </Box>
             : 
          <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <SearchSmall />
          </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}