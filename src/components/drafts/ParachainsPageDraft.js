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
import { PoolBox } from '../../features/pools/PoolBox'
import { PoolsBox } from '../../features/pools/PoolsBox'

import VotesByParachainsChart from './VotesByParachainsChart';
import PointsByParachainsChart from '../PointsByParachainsChart';
import SessionTimeline from '../SessionTimeline';
import onet from '../assets/onet.svg';
import { getNetworkName, getNetworkPoolId, getNetworkIcon } from '../../constants'
import apiSlice from '../../features/api/apiSlice'
import {
  chainChanged,
  selectChain,
} from '../../features/chain/chainSlice';


export const ParachainsPage = ({api}) => {
	const theme = useTheme();
  	const history = useHistory()
	const dispatch = useDispatch();
  	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const selected = useSelector(selectChain);

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
            <SessionTimeline />
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