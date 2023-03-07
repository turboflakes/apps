import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
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
  selectPoolBySessionAndPoolId
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
  const theme = useTheme();
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const selectedChain = useSelector(selectChain);
  const nSessionsTarget = getSessionsPerDayTarget(selectedChain);
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const pool = useSelector(state => selectPoolBySessionAndPoolId(state, currentSession, 1));
  useGetPoolsQuery({session: sessionIndex, show_metadata: true, show_nominees: true, show_stats: true, show_nomstats: true}, 
    {refetchOnMountOrArgChange: true, pollingInterval: 60000});
  
  useGetValidatorsQuery({session: sessionIndex, nominees_only: true, show_profile: true, show_summary: true});
  
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
        <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Typography variant='caption' align='right' sx={{mb: 1, mr: 3, color: theme.palette.grey[400]}}>
            {!isUndefined(pool) ? (!isUndefined(pool.stats) ? `last data collected at block #${pool.stats.block_number}` : "") : ""}
          </Typography>
        </Grid>
      </Grid>
		</Box>
  );
}