import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
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
import GradesBox from './GradesBox';
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
    <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center'}}>
		<Container sx={{ }}>
      <Grid container spacing={2}>
        <Grid sx={{ mt: 18 }} item xs={7} >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
              <Box sx={{
                minHeight: 288,
              }} >
                <Box sx={{display: 'flex'}}>
                  <Box sx={{
                      // ml: -20,
                      mt: -2,
                      width: 144,
                      height: 144,
                      // borderRadius: "50%",
                      position: 'relative',
                      // boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                      // boxShadow: 'rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px, rgba(240, 46, 170, 0.1) 20px 20px, rgba(240, 46, 170, 0.05) 25px 25px;',
                      // boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
                      // boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
                      
                      '&:before': {
                        content: '" "',
                        display: 'block',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        // opacity: 0.8,
                        backgroundImage: `url(${onetSVG})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '50% 50%',
                        backgroundSize: '144px 144px',
                      }
                  }}></Box>
                  <Box sx={{ ml: 4}}>
                    <Typography
                        component="h1"
                        variant="h2"
                        align="left"
                      >
                      <Typography component="div" variant="h5" >
                        Welcome to ONE-T
                      </Typography>
                       Insights Space
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ my: 4 }} variant="subtitle1" align="left">
                    Monitor and Explore the <b>KUSAMA</b> network. Search for your favourite Validators and visualize historic or realtime blockchain data performance.
                  </Typography>
                  <SearchSmall />
              </Box>
            </Box>
            {/* <Box sx={{ my: 6, ml: 4, display: 'flex', justifyContent: 'center', alignItems:'flex-end'}}>
              <SearchSmall />
              <img src={onetSVG} style={{ 
                // marginBottom: "16px",
                // opacity: 0.6,
                width: 128,
                height: 128 }} alt={"ONE-T logo"}/>
            </Box> */}
        </Grid>
        <Grid sx={{ mt: 8 }} item xs={5}>
          <GradesBox sessionIndex={currentSession} size="lg" />
        </Grid>

        
        <Grid item xs={12} sx={{ my: 6}}>
          <SessionPerformance600Timeline sessionIndex={currentSession} />
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

        

        <Grid item xs={12} >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
            {/* <Box sx={{ p: 2 }}>
              <Typography variant="h4">Kusama Network Stats</Typography>
              <Typography variant="subtitle" color="secondary">Collected from the last {maxHistorySessions} sessions ({maxHistoryEras} eras).</Typography>
            </Box> */}
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
		</Container>
    </Box>
  );
}