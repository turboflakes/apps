import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import PoolsGrid from './PoolsGrid';
import PoolsActiveBox from './PoolsActiveBox';
import PoolsMembersBox from './PoolsMembersBox';
import PoolsPointsBox from './PoolsPointsBox';
import PoolsPendingRewardsBox from './PoolsPendingRewardsBox';
import PoolsStakedBox from './PoolsStakedBox';
import PoolsNomineesBox from './PoolsNomineesBox';

import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { 
  useGetPoolsQuery,
 } from '../features/api/poolsSlice'
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice'
import { 
  selectIsLiveMode,
} from '../features/layout/layoutSlice'
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice'
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  getSessionsPerDayTarget
} from '../constants';

export default function PoolsOverviewPage({tab}) {
  // const theme = useTheme();
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const selectedChain = useSelector(selectChain);
  const nSessionsTarget = getSessionsPerDayTarget(selectedChain);
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const {isFetching, isSuccess} = useGetPoolsQuery({session: sessionIndex, show_metadata: true, show_nominees: true, show_stats: true, show_nomstats: true}, 
    {refetchOnMountOrArgChange: true, pollingInterval: 60000});

  const {isFetching: isFetchingValidators} = useGetValidatorsQuery({session: sessionIndex, nominees_only: true, show_profile: true, show_summary: true});
  
  useGetPoolsQuery({session: sessionIndex - nSessionsTarget, show_stats: true, show_nomstats: true}, 
      {refetchOnMountOrArgChange: true });

  return (
		<Box sx={{ m: 2, mt: 2, pt: 1, minHeight: '100vh'}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <PoolsActiveBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <PoolsNomineesBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <PoolsMembersBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <PoolsPointsBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <PoolsStakedBox sessionIndex={currentSession} />
        </Grid>
        <Grid item xs={12} md={2}>
          <PoolsPendingRewardsBox sessionIndex={currentSession} />
        </Grid>

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
          <PoolsGrid sessionIndex={sessionIndex} />
        </Grid>
      </Grid>
		</Box>
  );
}