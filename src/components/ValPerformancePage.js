import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
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



export const ValPerformancePage = ({api}) => {
	// const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const address = useSelector(selectAddress);
  const sessions = useSelector(selectSessionsAll)
  const session = sessions[sessions.length-1]

  const changeParams = (query, value) => {
    query.set("a", value)
		const location = {
			search: `?${query.toString()}`
		}
		history.replace(location)
	}

  React.useEffect(() => {
    let query = new URLSearchParams(history.location.search)
    // for (const
    if (!address) {
      const address = query.get('a')
      console.log("___useEffect 2", query, history.location);  
      dispatch(addressChanged(address));
    }
    // changeParams(query, address)
    // dispatch(addressChanged(address));
    // setAddress("");
    // console.log("___useEffect", query, history.location);
  }, [])
  
  return (
		<Box sx={{ m: 2, minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          {!!address ? <ValAddress address={address} /> : null}
          </Grid>
          <Grid item xs={12} md={3}>
            <BestBlock />
          </Grid>
          <Grid item xs={12} md={4}>
            <SessionPieChart />
        </Grid>
        <Grid item xs={12}>
          {!!address && !!session ? 
            <ValGroupBox address={address} sessionIndex={session.session_index} /> : 
            <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <SearchSmall />
            </Box>
          }
        </Grid>
      </Grid>
		</Box>
  );
}