import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const Dashboard = ({api}) => {
  return (
		<Box sx={{ m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
        Dashboard
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
		</Box>
  );
}