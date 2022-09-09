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
  selectIsSocketConnected,
} from '../features/api/socketSlice'

export const ValGroupPage = () => {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const currentSelected = useSelector(selectAddress);
  const currentSession = useSelector(selectSessionCurrent);
  let [searchParams] = useSearchParams();
  const searchAddress = searchParams.get("address");

  React.useEffect(() => {
    if (searchAddress && searchAddress !== currentSelected) {
      dispatch(addressChanged(searchAddress));
    }
  }, [searchAddress, currentSelected]);

  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
		<Box sx={{ m: 2, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          {/* {!!currentSelected ? <ValAddress address={currentSelected} /> : null} */}
          </Grid>
          <Grid item xs={12} md={4}>
          <SessionPieChart sessionIndex={currentSession} />
          </Grid>
          <Grid item xs={12} md={3}>
          <BestBlock />
        </Grid>
        <Grid item xs={12}>
          {!!currentSelected ? 
            <ValGroupBox address={currentSelected} sessionIndex={currentSession} /> : 
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchSmall />
            </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}