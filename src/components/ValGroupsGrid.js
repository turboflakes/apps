import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export const ValGroupsGrid = () => {
	// const theme = useTheme();
  
  return (
		<Box sx={{ m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
        </Grid>
      </Grid>
		</Box>
  );
}