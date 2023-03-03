import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValidatorSessionHistoryTimelineChart from './ValidatorSessionHistoryTimelineChart';
import ValHeaderBox from './ValHeaderBox';
import ValBodyBox from './ValBodyBox';
import ModeSwitch from './ModeSwitch';
import onetSVG from '../assets/onet.svg';
import {
  selectAddress,
  addressChanged
} from '../features/chain/chainSlice';
import { 
  selectSessionHistory,
  selectSessionCurrent,
 } from '../features/api/sessionsSlice';
import { 
  selectIsLiveMode,
  selectIsHistoryMode,
  selectMode,
  selectMaxHistorySessions
} from '../features/layout/layoutSlice';
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice';
import { 
  useGetValidatorByAddressQuery,
} from '../features/api/validatorsSlice';

export default function ValidatorPage() {
	// const theme = useTheme();
  const { stash } = useParams();
  const dispatch = useDispatch();
  const selectedMode = useSelector(selectMode);
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const {data: validator, isFetching, isSuccess, isError} = useGetValidatorByAddressQuery({address: stash, session: sessionIndex, show_summary: true, show_stats: true});

  React.useEffect(() => {
    if (stash && stash !== selectedAddress) {
      dispatch(addressChanged(stash));
    }
  }, [stash, selectedAddress]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, mt: 2, pt: 1, minHeight: '100vh'}}>
      <Grid container spacing={2}>
        
        {isError ?
          <Grid item xs={12}>
            <Box sx={{display: "flex", justifyContent:"center", 
              alignItems: "center", height: "80vh", }}>
              <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <img src={onetSVG} style={{ 
                    margin: "32px",
                    opacity: 0.1,
                    width: 256,
                    height: 256 }} alt={"ONE-T logo"}/>
                <Typography variant="h6" color="secondary">The stash address was not found.</Typography>
                <Typography variant="h6" color="secondary">{document.location.href}</Typography>
              </Box>
            </Box>
          </Grid> : null}

        {isSuccess ? 
          <Grid item xs={12}>
            <ValHeaderBox address={selectedAddress} sessionIndex={sessionIndex} />
          </Grid> : null}

        {isSuccess ?
          <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <ModeSwitch mode={selectedMode} />
            </Box>
          </Grid> : null}

        {isHistoryMode ?
          <Grid item xs={12}>
            <ValidatorSessionHistoryTimelineChart address={selectedAddress} maxSessions={maxHistorySessions} />
          </Grid> : null }

        {isSuccess ?
          <Grid item xs={12}>
            <ValBodyBox address={selectedAddress} sessionIndex={sessionIndex} />
          </Grid> : null}

      </Grid>
		</Box>
  );
}