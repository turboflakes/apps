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
  selectIsLiveMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice';

export default function ValBodyBox({address, sessionIndex}) {
	const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const isLiveMode = useSelector(selectIsLiveMode)
  
  return (
		<Box sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={isLiveMode ? 6 : 7}>
        {isLiveMode ? 
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center'}}>
            <Box style={{ width: '16px', height: '16px', marginBottom: '8px', marginRight: '16px', borderRadius: '50%', 
              animation: "pulse 1s infinite ease-in-out alternate",
              backgroundColor: theme.palette.semantics.green, 
              display: "inline-block" }}></Box>
            <Typography variant="h3">Live Performance</Typography>
          </Box> 
          : 
          <Box sx={{  p: 2 }}>
            <Typography variant="h3">Performance History</Typography>
            <Typography variant="subtitle" color="secondary">Previous {maxHistorySessions} sessions ({maxHistoryEras} eras).</Typography>
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

        <Grid item xs={12} md={isLiveMode ? 4 : 3}>
          <SessionBox sessionIndex={sessionIndex} address={address} dark={!isLiveMode} />
        </Grid>
        
        {!isLiveMode ?
          <Grid item xs={12}>
            <SessionSlider maxSessions={maxHistorySessions} /> 
          </Grid> : null}

        {!isLiveMode ?
          <Grid item xs={12}>
            <ValidatorSessionHistoryPointsChart address={address} maxSessions={maxHistorySessions} />
          </Grid> : null}
      </Grid>
		</Box>
  );
}