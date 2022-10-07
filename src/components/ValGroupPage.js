import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import SessionPieChart from './SessionPieChart';
import BlockFinalizedBox from './BlockFinalizedBox';
import ValGroupBox from './ValGroupBox';
import ValAddress from './ValAddress';
import SearchSmall from './SearchSmall';
import ValHeaderBox from './ValHeaderBox';
import ValidatorSessionHistoryPointsChart from './ValidatorSessionHistoryPointsChart';
import {
  selectChain,
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
} from '../features/layout/layoutSlice';
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice';
import { getMaxHistorySessions } from '../constants';


export const ValGroupPage = () => {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  const isHistoryMode = useSelector(selectIsHistoryMode);
  const selectedChain = useSelector(selectChain);
  const maxSessions = getMaxHistorySessions(selectedChain);
  let [searchParams] = useSearchParams();
  const searchAddress = searchParams.get("address");
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);

  React.useEffect(() => {
    if (searchAddress && searchAddress !== selectedAddress) {
      dispatch(addressChanged(searchAddress));
    }
  }, [searchAddress, selectedAddress]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, minHeight: '100vh', mt: isLiveMode ? '16px' : '112px' }}>
      <Grid container spacing={2}>

        {/* History section */}
        {isHistoryMode ? 
          <Grid item xs={12}>
            <ValHeaderBox address={selectedAddress} sessionIndex={sessionIndex} />
            {/* {!!selectedAddress ? <ValAddress address={selectedAddress}  sessionIndex={sessionIndex} showGrade /> : null} */}
          </Grid>
        : null}
        {/* {isHistoryMode ? 
          <Grid item xs={12}>
            <ValidatorSessionHistoryPointsChart address={selectedAddress} maxSessions={maxSessions} />
          </Grid>
        : null} */}

        {isHistoryMode ? 
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
        : null}

        {/* val. Group section */}
        <Grid item xs={12} md={8}>
          {!!selectedAddress ? <ValAddress address={selectedAddress}  sessionIndex={sessionIndex} showGrade /> : null}
        </Grid>

        {/* Live Mode */}
        {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <SessionPieChart sessionIndex={sessionIndex} />
          </Grid>
        : null}
        {isLiveMode ? 
          <Grid item xs={12} md={2}>
            <BlockFinalizedBox />
          </Grid>
        : null}
        {/* ---------- */}
        
        <Grid item xs={12}>
          {!!selectedAddress ? 
            <ValGroupBox address={selectedAddress} sessionIndex={sessionIndex} /> : 
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchSmall />
            </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}