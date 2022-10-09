import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ValAddressProfile from './ValAddressProfile';
import ValMvrBox from './ValMvrBox';
import ValPointsBox from './ValPointsBox';
import ValAuthoredBlocksBox from './ValAuthoredBlocksBox';
import ValInclusionBox from './ValInclusionBox';
import ValParaInclusionBox from './ValParaInclusionBox';
import ValidatorSessionHistoryPointsChart from './ValidatorSessionHistoryPointsChart';
import {
  selectChain,
  selectAddress,
} from '../features/chain/chainSlice';
import { getMaxHistorySessions } from '../constants';


export default function ValHeaderBox({address}) {
	// const theme = useTheme();
  const selectedAddress = useSelector(selectAddress);
  const selectedChain = useSelector(selectChain);
  const maxSessions = getMaxHistorySessions(selectedChain);

  return (
		<Box sx={{ 
        // p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      {/* <Box>
        <Typography variant="h4">Validator Performance History</Typography>
        <Typography variant="subtitle" paragraph>Stats from the previous {maxSessions} sessions</Typography>
      </Box> */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex'}}>
            <ValAddressProfile address={address} maxSessions={maxSessions} showGrade />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <ValMvrBox address={address} maxSessions={maxSessions} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ValPointsBox address={address} maxSessions={maxSessions} />
            </Grid>
            <Grid item xs={12} md={4}>
              {/* TODO disputes */}
            </Grid>
            <Grid item xs={12} md={4}>
              <ValAuthoredBlocksBox address={address} maxSessions={maxSessions} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ValInclusionBox address={address} maxSessions={maxSessions} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ValParaInclusionBox address={address} maxSessions={maxSessions} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
		</Box>
  );
}