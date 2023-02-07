import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionBox from './SessionBox';
import SessionPieChart from './SessionPieChart';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ParachainsOverviewTabs from './ParachainsOverviewTabs';
import EraPointsBox from './EraPointsBox';
import SessionPointsBox from './SessionPointsBox';
import AuthoredBlocksBox from './AuthoredBlocksBox';
import AuthoredBlocksHistoryBox from './AuthoredBlocksHistoryBox';
import BackingPointsBox from './BackingPointsBox';
import BackingPointsHistoryBox from './BackingPointsHistoryBox';
import AuthoritiesBox from './AuthoritiesBox';
import GradesSmallBox from './GradesSmallBox';
import SessionHistoryTimelineChart from './SessionHistoryTimelineChart';
import NetTotalValidatorsBox from './NetTotalValidatorsBox';
import NetActiveValidatorsBox from './NetActiveValidatorsBox';
import NetOversubscribedValidatorsBox from './NetOversubscribedValidatorsBox';
import NetPointsValidatorsBox from './NetPointsValidatorsBox';
import NetOwnStakeValidatorsBox from './NetOwnStakeValidatorsBox';
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

export default function DashboardPage() {
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
		<Box sx={{ m: 2, minHeight: '100vh', mt: isLiveMode ? 2 : 12 }}>
      <Grid container spacing={2}>
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <NetTotalValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <NetActiveValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <NetOversubscribedValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <NetPointsValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={6} md={4}>
            <NetOwnStakeValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
          </Grid>
        : null}
        {/* {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <SessionPerformancePieChart />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <SessionPieChart sessionIndex={sessionIndex} />
          </Grid> : null}
        
        <Grid item xs={12} md={isHistoryMode ? 3 : 4}>
          <SessionBox sessionIndex={sessionIndex} dark={isHistoryMode} />
        </Grid>
        <Grid item xs={12} md={2}>
          <AuthoritiesBox sessionIndex={sessionIndex} dark={isHistoryMode} />
        </Grid>
        <Grid item xs={12} md={2}>
          <GradesSmallBox sessionIndex={sessionIndex} dark={isHistoryMode} />
        </Grid>
        <Grid item xs={12} md={2}>
          {isLiveMode ? <AuthoredBlocksBox /> : <AuthoredBlocksHistoryBox sessionIndex={sessionIndex} />}
        </Grid>
        <Grid item xs={12} md={2}>
          {isLiveMode ? <BackingPointsBox /> : <BackingPointsHistoryBox sessionIndex={sessionIndex} />}
        </Grid>
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <SessionPointsBox />
          </Grid> : null}
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <EraPointsBox />
          </Grid> : null} */}
      </Grid>
		</Box>
  );
}