import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BestBlock from './BestBlock';
import ValGroupBox from './ValGroupBox';
import ValAddress from './ValAddress';
import {
  selectAddress
} from '../features/chain/chainSlice';



export const ValPerformancePage = ({api}) => {
	// const theme = useTheme();
  const address = useSelector(selectAddress);
  
  return (
		<Box sx={{ m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <ValAddress address={address} />
          </Grid>
          <Grid item xs={12} md={3}>
            <BestBlock />
          </Grid>
          <Grid item xs={12} md={4}>
            <SessionPieChart />
        </Grid>
        <Grid item xs={12}>
          <ValGroupBox stash={address} />
        </Grid>
      </Grid>
		</Box>
  );
}