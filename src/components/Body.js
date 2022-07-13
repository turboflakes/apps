import * as React from 'react';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PoolBox } from '../features/pools/PoolBox'
import { PoolsBox } from '../features/pools/PoolsBox'

import VotesByParachainsChart from './VotesByParachainsChart';
import PointsByParachainsChart from './PointsByParachainsChart';
import SessionPieChart from './SessionPieChart';
import onet from '../assets/onet.svg';
import { getNetworkName, getNetworkPoolId, getNetworkIcon } from '../constants'
import apiSlice from '../features/api/apiSlice'
import {
  chainChanged,
  selectChain,
} from '../features/chain/chainSlice';
import {
  selectPage,
} from '../features/layout/layoutSlice';


export const Body = ({api}) => {
	const theme = useTheme();
  const history = useHistory()
	const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const selected = useSelector(selectChain);
  const selectedPage = useSelector(selectPage);

	// const handleExt = () => {
	// 	window.open('https://wiki.polkadot.network/docs/thousand-validators', '_blank')
	// }

  const handleClick = () => {
    dispatch(chainChanged('kusama'));
		// Invalidate cached pools so it re-fetchs pools from selected chain
		dispatch(apiSlice.util.invalidateTags(['Pool']));
    history.replace(`/${'kusama'}`)
  };

  return (
		<Box sx={{ m: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          {/* Parachains Chart */}
          <Paper
            sx={{
              p: 2,
              // m: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: 446,
              borderRadius: 3,
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
            }}
            >
            <VotesByParachainsChart />
          </Paper>            
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 3,
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
                // background: "linear-gradient(90deg,rgba(0,0,0,0.1), rgba(0,0,0,0.3))"
              }}
              >
                {/* <Box sx={{ borderRadius: 6, p: 1, width: 60, height: 60, bgcolor: '#F7F7FA'}}> */}
                  <Typography sx={{ml: 1}} variant="h4" align="center">❒</Typography>
                {/* </Box> */}
                <Typography variant="h4" align='right'># 13,680,000</Typography>
            </Paper>
          </Grid>
            <Grid item xs={12}>
              <SessionPieChart />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              // m: 2,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: 700,
              borderRadius: 3,
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
            }}
            >
            <PointsByParachainsChart />
          </Paper>
        </Grid>
      </Grid>
		</Box>
  );
}