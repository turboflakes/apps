import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BestBlock from './BestBlock';
import { ValGroupsGrid } from './ValGroupsGrid';

export const ValGroupsPage = () => {
	// const theme = useTheme();
  
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
          <ValGroupsGrid />
        </Grid>
      </Grid>
		</Box>
  );
}