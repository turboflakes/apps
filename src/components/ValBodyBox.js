import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SessionPieChart from './SessionPieChart';
import SessionBox from './SessionBox';
import ValStateBox from './ValStateBox';
import SessionSlider from './SessionSlider';
import ValidatorSessionHistoryPointsChart from './ValidatorSessionHistoryPointsChart';
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';
import { 
  getMaxHistoryEras,
  getMaxHistorySessions } from '../constants';

export default function ValBodyBox({address, sessionIndex}) {
	const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const maxSessions = getMaxHistorySessions(selectedChain);
  const maxEras = getMaxHistoryEras(selectedChain);
  const isLiveMode = useSelector(selectIsLiveMode)
  
  return (
		<Box sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        {isLiveMode ? 
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Typography variant="h3">Live Performance</Typography>
            <span style={{ width: '16px', height: '16px', marginTop: '8px', marginLeft: '16px', borderRadius: '50%', 
                animation: "pulse 1s infinite ease-in-out alternate",
                backgroundColor: theme.palette.semantics.green, 
                display: "inline-block" }}></span>
          </Box> 
          : 
          <Box>
            <Typography variant="h3">Performance History</Typography>
            <Typography variant="subtitle" color="secondary">Previous {maxSessions} sessions ({maxEras} eras).</Typography>
          </Box>
        }
        </Grid>
        {!isLiveMode ? 
          <Grid item xs={12} md={2}>
            <ValStateBox address={address} sessionIndex={sessionIndex} dark={!isLiveMode} />
          </Grid> : null}
        {isLiveMode ?
          <Grid item xs={12} md={2}>
            <SessionPieChart sessionIndex={sessionIndex} /> 
          </Grid> : null}

        <Grid item xs={12} md={4}>
          <SessionBox sessionIndex={sessionIndex} address={address} dark={!isLiveMode} />
        </Grid>

        
        {!isLiveMode ?
          <Grid item xs={12}>
            <SessionSlider maxSessions={maxSessions} /> 
          </Grid> : null}

        {!isLiveMode ?
          <Grid item xs={12}>
            <ValidatorSessionHistoryPointsChart address={address} maxSessions={maxSessions} />
          </Grid> : null}
      </Grid>
		</Box>
  );
}