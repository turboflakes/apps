import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BlockBox from './BlockBox';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ParachainsOverviewTabs from './ParachainsOverviewTabs';
import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { 
  selectIsLiveMode,
} from '../features/layout/layoutSlice'
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export const ParachainsOverviewPage = ({tab}) => {
	// const theme = useTheme();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, minHeight: '100vh', mt: isLiveMode ? '16px' : '112px' }}>
      <Grid container spacing={2}>
        <Grid item xs={3} md={isLiveMode ? 3 : 8}>
          <SessionPerformanceTimeline />
        </Grid>
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <SessionPerformancePieChart />
          </Grid>
        : null}
        <Grid item xs={12} md={4}>
          <SessionPieChart sessionIndex={sessionIndex} />
        </Grid>
        {isLiveMode ? 
          <Grid item xs={12} md={3}>
            <BlockBox />
          </Grid>
        : null}
        <Grid item xs={12}>
          {!!sessionIndex ? <ParachainsOverviewTabs sessionIndex={sessionIndex} tab={tab} /> : null}
        </Grid>
      </Grid>
		</Box>
  );
}