import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValidatorSessionHistoryTimelineChart from './ValidatorSessionHistoryTimelineChart';
import ValGroupBoxHistoryTabs from './ValGroupBoxHistoryTabs';
import ValGroupBox from './ValGroupBox';
import {
  selectIsLiveMode,
  selectIsHistoryMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice';
import { 
  selectValidatorBySessionAndAddress,
} from '../features/api/validatorsSlice';
import onetSVG from '../assets/onet.svg';

export default function ValBodyBox({address, sessionIndex}) {
	// const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))
  
  if (isUndefined(validator)) {
    return null
  }

  const status = validator.is_auth && validator.is_para ? 
    `The validator is PARA-AUTHORITY at session ${validator.session}.` : 
      (validator.is_auth ? 
        `The validator is AUTHORITY at session ${validator.session}.`  : 
          `The validator is NOT AUTHORITY at session ${validator.session}.`);

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
          
        {isLiveMode && validator.is_auth && validator.is_para ?
          <Grid item xs={12}>
            <ValGroupBox address={address} sessionIndex={sessionIndex} />
          </Grid> : 
          <Grid item xs={12}>
            <Box sx={{display: "flex", justifyContent:"center", 
              alignItems: "center", height: "50vh", }}>
              <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <img src={onetSVG} style={{ 
                    margin: "32px",
                    opacity: 0.1,
                    width: 256,
                    height: 256 }} alt={"ONE-T logo"}/>
                <Typography variant="h6" color="secondary">{status}</Typography>
              </Box>
            </Box>
          </Grid>
        }
      </Grid>
		</Box>
  );
}