import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BestBlock from './BestBlock';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ParachainsOverviewTabs from './ParachainsOverviewTabs';
import { 
  selectSessionsAll,
 } from '../features/api/sessionsSlice'
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export const ParachainsOverviewPage = () => {
	// const theme = useTheme();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const sessions = useSelector(selectSessionsAll)
  const session = sessions[sessions.length-1]

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <SessionPerformanceTimeline />
        </Grid>
        <Grid item xs={12} md={2}>
          <SessionPerformancePieChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionPieChart />
        </Grid>
        <Grid item xs={12} md={3}>
          <BestBlock />
        </Grid>
        <Grid item xs={12}>
          {!!session ? <ParachainsOverviewTabs sessionIndex={session.six} /> : null}
        </Grid>
      </Grid>
		</Box>
  );
}