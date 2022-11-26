import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import SessionBox from './SessionBox';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ParachainsOverviewTabs from './ParachainsOverviewTabs';
import EraPointsBox from './EraPointsBox';
import SessionPointsBox from './SessionPointsBox';
import AuthoredBlocksBox from './AuthoredBlocksBox';
import BackingPointsBox from './BackingPointsBox';
import AuthoritiesBox from './AuthoritiesBox';
import GradesSmallBox from './GradesSmallBox';
import SessionHistoryTimelineChart from './SessionHistoryTimelineChart';

import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { 
  selectIsLiveMode,
  selectIsHistoryMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice'
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export const ParachainsOverviewPage = ({tab}) => {
  // const theme = useTheme();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, minHeight: '100vh', mt: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          {isLiveMode ? <SessionPerformanceTimeline sessionIndex={sessionIndex} /> : null}
        </Grid>
        <Grid item xs={12} md={2}>
          {isLiveMode ? <SessionPerformancePieChart /> : null}
        </Grid>
        <Grid item xs={12} md={2}>
          {isLiveMode ? <SessionPieChart sessionIndex={sessionIndex} /> : null}
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionBox sessionIndex={sessionIndex} dark={!isLiveMode} />
        </Grid>
        <Grid item xs={12} md={2}>
          <AuthoritiesBox sessionIndex={sessionIndex} />
        </Grid>
        <Grid item xs={12} md={2}>
          <GradesSmallBox sessionIndex={sessionIndex} />
        </Grid>
        <Grid item xs={12} md={2}>
          <AuthoredBlocksBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <BackingPointsBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <SessionPointsBox />
        </Grid>
        <Grid item xs={12} md={2}>
          <EraPointsBox />
        </Grid>
        {isHistoryMode ?
          <Grid item xs={12}>
            <SessionHistoryTimelineChart maxSessions={maxHistorySessions} />
          </Grid> : null}
        <Grid item xs={12}>
          {!!sessionIndex ? <ParachainsOverviewTabs sessionIndex={sessionIndex} tab={tab} /> : null}
        </Grid>
      </Grid>
		</Box>
  );
}