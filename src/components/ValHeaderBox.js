import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ValAddressProfile from './ValAddressProfile';
import ValMvrBox from './ValMvrBox';
import ValMvrHistoryBox from './ValMvrHistoryBox';
import ValBackingPointsBox from './ValBackingPointsBox';
import ValBackingPointsHistoryBox from './ValBackingPointsHistoryBox';
import ValAuthoredBlocksBox from './ValAuthoredBlocksBox';
import ValTotalPointsBox from './ValTotalPointsBox';
import ValEraPointsBox from './ValEraPointsBox';
import ValEraPointsHistoryBox from './ValEraPointsHistoryBox';
import ValAuthoredBlocksHistoryBox from './ValAuthoredBlocksHistoryBox';
import ValInclusionBox from './ValInclusionBox';
import ValDisputesHistoryBox from './ValDisputesHistoryBox';
import ValStateBox from './ValStateBox';
import ValParaInclusionBox from './ValParaInclusionBox';
import {
  selectSessionByIndex,
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectIsLiveMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice';

const ORDER = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

export default function ValHeaderBox({address, sessionIndex}) {
	// const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const maxHistoryEras = useSelector(selectMaxHistoryEras);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const session = useSelector(state => selectSessionByIndex(state, currentSession))

  if (isNaN(sessionIndex) || isUndefined(session)) {
    return null
  }

  return (
		<Box sx={{ 
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex'}}>
            <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box sx={{ 
            // pl: 2,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: 3,
            // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
            // background: theme.palette.gradients.light180,
            // border: `1px solid ${theme.palette.neutrals[200]}`,
            // boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;'
          }}>
            <Grid container spacing={2}>
              {/* first row */}
              <Grid item xs={12} md={3}>
                {isLiveMode ? 
                  <ValStateBox address={address} sessionIndex={sessionIndex} /> :
                  <Box sx={{ 
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: 96,
                    }}> 
                    <Typography variant="h6">History Stats</Typography>
                    <Typography variant="subtitle2">{isLiveMode ? `${ORDER[session.esix-1]} session of era ${session.eix.format()}` : `Previous ${maxHistorySessions} sessions (${maxHistoryEras} eras)`}</Typography>
                  </Box> }
              </Grid>
              <Grid item xs={12} md={isLiveMode ? 3 : 3}>
                  {isLiveMode ? 
                    <ValAuthoredBlocksBox address={address} /> :
                    <ValAuthoredBlocksHistoryBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              <Grid item xs={12} md={isLiveMode ? 3 : 3}>
                  {isLiveMode ? 
                    <ValTotalPointsBox address={address} /> :
                    <ValEraPointsHistoryBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              <Grid item xs={12} md={3}>
                  {isLiveMode ? 
                    <ValEraPointsBox address={address} /> :
                    <ValInclusionBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              {/* second row */}
              <Grid item xs={12} md={3}>
                {isLiveMode ? 
                  <ValMvrBox address={address} /> : 
                  <ValMvrHistoryBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              <Grid item xs={12} md={3}>
                {isLiveMode ? 
                  <ValBackingPointsBox address={address} /> : 
                  <ValBackingPointsHistoryBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              <Grid item xs={12} md={3}>
                {isLiveMode ? 
                  null :
                  <ValParaInclusionBox address={address} maxSessions={maxHistorySessions} /> }
              </Grid>
              <Grid item xs={12} md={3}>
                {isLiveMode ? 
                  null :
                  <ValDisputesHistoryBox address={address} maxSessions={maxHistorySessions}/> }
              </Grid>
              {/* <Grid item xs={12} md={4}>
                TODO disputes
              </Grid> */}
            </Grid>
          </Box>
        </Grid>
      </Grid>
		</Box>
  );
}