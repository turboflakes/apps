import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import OverviewTabs from './OverviewTabs';
import EraPointsBox from './EraPointsBox';
import SessionPointsBox from './SessionPointsBox';
import AuthoredBlocksBox from './AuthoredBlocksBox';
import BackingPointsBox from './BackingPointsBox';
import AuthoritiesBox from './AuthoritiesBox';
import GradesSmallBox from './GradesSmallBox';
import CollationAuthoritiesBox from './CollationAuthoritiesBox';
import CollationBlocksBox from './CollationBlocksBox';
import CollationPointsBox from './CollationPointsBox';
import CollationGradesBox from './CollationGradesBox';
import CollationSlotBox from './CollationSlotBox';
import CollationHeader from './CollationHeader';

import {
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { selectChain } from '../features/chain/chainSlice';
import { isCollationAvailable } from '../constants';
import {
  selectIsLiveMode,
} from '../features/layout/layoutSlice'
import {
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export default function OverviewPage({tab}) {
  // const theme = useTheme();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const isLiveMode = useSelector(selectIsLiveMode);
  const selectedChain = useSelector(selectChain);
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

        <Grid item xs={12} md={2}>
          <AuthoritiesBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <GradesSmallBox sessionIndex={currentSession} />
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

        {isCollationAvailable(selectedChain) && (
          <>
            <Grid item xs={12}>
              <Divider sx={{
                mt: 1,
                opacity: 0.25,
                height: '1px',
                borderTop: '0px solid rgba(0, 0, 0, 0.08)',
                borderBottom: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
                }} />
            </Grid>
            {/* Asset Hub */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CollationHeader chainKey="ah" name="Asset Hub" />
                </Grid>
                 <Grid item xs={12} md={4}>
                  <CollationAuthoritiesBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationBlocksBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationPointsBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationGradesBox chainKey="ah" />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CollationSlotBox chainKey="ah" />
                </Grid>
              </Grid>
            </Grid>
            {/* People */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CollationHeader chainKey="pp" name="People" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationAuthoritiesBox chainKey="pp" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationBlocksBox chainKey="pp" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationPointsBox chainKey="pp" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CollationGradesBox chainKey="pp" name="people" />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CollationSlotBox chainKey="pp" />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <Divider sx={{
            mt: 1,
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} />
        </Grid>

        <Grid item xs={12}>
          <OverviewTabs sessionIndex={sessionIndex} tab={tab} />
        </Grid>

      </Grid>
		</Box>
  );
}
