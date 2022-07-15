import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BestBlock from './BestBlock';
import { ValGroupsGrid } from './ValGroupsGrid';
import { 
  useGetSessionByIndexQuery,
  selectSessionsAll,
 } from '../features/api/sessionsSlice'

export const ValGroupsPage = () => {
	// const theme = useTheme();
  const sessions = useSelector(selectSessionsAll)
  const session = sessions[sessions.length-1]

  return (
		<Box sx={{ m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
        </Grid>
        <Grid item xs={12} md={3}>
          <BestBlock />
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionPieChart />
        </Grid>
        <Grid item xs={12}>
          {!!session ? <ValGroupsGrid sessionIndex={session.session_index} /> : null}
        </Grid>
      </Grid>
		</Box>
  );
}