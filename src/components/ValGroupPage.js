import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SessionPieChart from './SessionPieChart';
import BestBlock from './BestBlock';
import ValGroupBox from './ValGroupBox';
import ValAddress from './ValAddress';
import SearchSmall from './SearchSmall';
import {
  selectAddress,
  addressChanged
} from '../features/chain/chainSlice';
import { 
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'
import { 
  selectIsLiveMode,
} from '../features/layout/layoutSlice'
import { 
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export const ValGroupPage = () => {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const selectedAddress = useSelector(selectAddress);
  const currentSession = useSelector(selectSessionCurrent);
  const isLiveMode = useSelector(selectIsLiveMode);
  let [searchParams] = useSearchParams();
  const searchAddress = searchParams.get("address");

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
        <Grid item xs={12} md={isLiveMode ? 5 : 8}>
          {!!selectedAddress ? <ValAddress address={selectedAddress}  sessionIndex={currentSession} showGrade /> : null}
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionPieChart sessionIndex={currentSession} />
        </Grid>
        {isLiveMode ? 
          <Grid item xs={12} md={3}>
            <BestBlock />
          </Grid>
        : null}
        <Grid item xs={12}>
          {!!selectedAddress ? 
            <ValGroupBox address={selectedAddress} sessionIndex={currentSession} /> : 
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchSmall />
            </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}