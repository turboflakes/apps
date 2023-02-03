import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import SessionBox from './SessionBox';
import SessionPieChart from './SessionPieChart';
import SessionPerformancePieChart from './SessionPerformancePieChart';
import SessionPerformanceTimeline from './SessionPerformanceTimeline';
import ValidatorsInsights from './ValidatorsInsights';
import ValidatorsHistoryInsights from './ValidatorsHistoryInsights';
import EraPointsBox from './EraPointsBox';
import SessionPointsBox from './SessionPointsBox';
import AuthoredBlocksBox from './AuthoredBlocksBox';
import BackingPointsBox from './BackingPointsBox';
import AuthoritiesBox from './AuthoritiesBox';
import GradesSmallBox from './GradesSmallBox';
import SubsetBox from './SubsetBox';

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

export default function InsightsPage() {
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

        {/* 2nd row */}
        
        { isLiveMode ?
          <Grid item xs={12} md={2}>
            <AuthoritiesBox sessionIndex={sessionIndex} dark={isHistoryMode} />
          </Grid> : null}
        { isLiveMode ?
        <Grid item xs={12} md={2}>
          <GradesSmallBox sessionIndex={sessionIndex} dark={isHistoryMode} />
        </Grid> : null }
        { isLiveMode ?
          <Grid item xs={12} md={2}>
            <AuthoredBlocksBox />
          </Grid> : null }
        { isLiveMode ?
          <Grid item xs={12} md={2}>
            <BackingPointsBox />
          </Grid> : null }
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <SessionPointsBox />
          </Grid> : null}
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <EraPointsBox />
          </Grid> : null}
        
        {/* --- divider line --- */}
        
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

        {/* --- validators data grid --- */}

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