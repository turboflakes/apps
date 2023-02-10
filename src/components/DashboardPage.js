import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import SessionPerformance600Timeline from './SessionPerformance600Timeline';
import NetTotalStakedBox from './NetTotalStakedBox';
import NetLastRewardBox from './NetLastRewardBox';
import NetTotalValidatorsBox from './NetTotalValidatorsBox';
import NetActiveValidatorsBox from './NetActiveValidatorsBox';
import NetOversubscribedValidatorsBox from './NetOversubscribedValidatorsBox';
import NetPointsValidatorsBox from './NetPointsValidatorsBox';
import NetOwnStakeValidatorsBox from './NetOwnStakeValidatorsBox';
import SearchSmall from './SearchSmall';
import HistoryErasMenu from './HistoryErasMenu';
import onetSVG from '../assets/onet.svg';
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
		<Box sx={{ m: 2, mt: 2, pt: 1, minHeight: '100vh'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <SearchSmall />
          </Box>
        </Grid>

        {/* <Grid item xs={12}>
          <Divider sx={{ 
            my: 1,
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} />
        </Grid> */}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
            <img src={onetSVG} style={{ 
              // margin: "8px",
              opacity: 0.6,
              width: 128,
              height: 128 }} alt={"ONE-T logo"}/>
          </Box>
          <SessionPerformance600Timeline sessionIndex={currentSession} />
        </Grid> 

        <Grid item xs={12} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h4">Kusama Network Stats</Typography>
              <Typography variant="subtitle" color="secondary">Collected from the last {maxHistorySessions} sessions ({maxHistoryEras} eras).</Typography>
            </Box>
            <Box>
              <HistoryErasMenu />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <NetTotalStakedBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
          <NetLastRewardBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
        </Grid>
        <Grid item xs={6} md={4}>
        </Grid>
        <Grid item xs={6} md={4}>
          <NetTotalValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
          <NetActiveValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
          <NetOversubscribedValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
          <NetPointsValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
        <Grid item xs={6} md={4}>
          <NetOwnStakeValidatorsBox sessionIndex={sessionIndex} maxSessions={maxHistorySessions} />
        </Grid>
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