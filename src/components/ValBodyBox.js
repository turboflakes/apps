import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValAddressProfile from './ValAddressProfile';
import SessionBox from './SessionBox';
import ValStateBox from './ValStateBox';
import ValAuthoredBlocksBox from './ValAuthoredBlocksBox';
import ValInclusionBox from './ValInclusionBox';
import ValParaInclusionBox from './ValParaInclusionBox';
import ValidatorSessionHistoryPointsChart from './ValidatorSessionHistoryPointsChart';
import {
  selectChain,
  selectAddress,
} from '../features/chain/chainSlice';
import { 
  getMaxHistoryEras,
  getMaxHistorySessions } from '../constants';
import { 
  selectSessionByIndex
 } from '../features/api/sessionsSlice';

export default function ValBodyBox({address, sessionIndex}) {
	// const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const maxSessions = getMaxHistorySessions(selectedChain);
  const maxEras = getMaxHistoryEras(selectedChain);
  
  return (
		<Box sx={{ 
        // p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h3">Performance History</Typography>
            <Typography variant="subtitle" color="secondary">Previous {maxSessions} sessions ({maxEras} eras).</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionBox sessionIndex={sessionIndex} address={address} dark />
        </Grid>
        {/* <Grid item xs={12} md={2}>
          <ValStateBox address={address} sessionIndex={sessionIndex} dark />
        </Grid> */}
        <Grid item xs={12}>
          <ValidatorSessionHistoryPointsChart address={address} maxSessions={maxSessions} />
        </Grid>
      </Grid>
		</Box>
  );
}