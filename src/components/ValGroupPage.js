import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from "react-router-dom";
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
  selectSessionsAll,
 } from '../features/api/sessionsSlice'


export const ValGroupPage = () => {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const currentSelected = useSelector(selectAddress);
  const sessions = useSelector(selectSessionsAll)
  const session = sessions[sessions.length-1]
  let [searchParams, setSearchParams] = useSearchParams();
  const searchAddress = searchParams.get("address");

  React.useEffect(() => {
    
    if (searchAddress && searchAddress !== currentSelected) {
      dispatch(addressChanged(searchAddress));
    }
  }, [searchAddress, currentSelected]);

  return (
		<Box sx={{ m: 2, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          {!!currentSelected ? <ValAddress address={currentSelected} /> : null}
          </Grid>
          <Grid item xs={12} md={4}>
            <SessionPieChart />
          </Grid>
          <Grid item xs={12} md={3}>
            <BestBlock />
        </Grid>
        <Grid item xs={12}>
          {!!currentSelected && !!session ? 
            <ValGroupBox address={currentSelected} sessionIndex={session.six} /> : 
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchSmall />
            </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}