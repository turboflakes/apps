import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SessionPieChart from './SessionPieChart';
import SessionBox from './SessionBox';
import ValStateBox from './ValStateBox';
import ValidatorSessionHistoryTimelineChart from './ValidatorSessionHistoryTimelineChart';
import ValGroupBoxHistoryTabs from './ValGroupBoxHistoryTabs';
import ValGroupBox from './ValGroupBox';
import {
  selectIsLiveMode,
  selectIsHistoryMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice';

export default function ValBodyBox({address, sessionIndex}) {
	// const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);

  return (
		<Box sx={{ 
        m: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Grid container spacing={2}>
      {isHistoryMode ?
        <Grid item xs={12} md={7}>
          <Box sx={{  p: 2 }}>
            <Typography variant="h3">Performance History</Typography>
            <Typography variant="subtitle" color="secondary">Covering {maxHistorySessions} sessions ({maxHistoryEras} eras)</Typography>
          </Box> 
        </Grid>: null }
        
        {isHistoryMode ?
          <Grid item xs={12}>
            <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} />
          </Grid> : null}

        {isHistoryMode ?
          <Grid item xs={12}>
            <ValGroupBoxHistoryTabs address={address} maxSessions={maxHistorySessions} />
          </Grid> : null}
        
        {isLiveMode ?
          <Grid item xs={12}>
            <ValGroupBox address={address} sessionIndex={sessionIndex} />
          </Grid> : null}

      </Grid>
		</Box>
  );
}