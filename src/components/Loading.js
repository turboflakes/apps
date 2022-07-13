import React from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import onet from '../assets/onet.svg';
import { Typography } from '@mui/material';

export const Loading = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box sx={{
      // background: "linear-gradient(180deg, #45CDE9, #7A8FD3)", 
      display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh'}}>
      <img src={onet} style={matches ? {width: 128, height: 128 } : {width: 288, height: 288 }} alt={"logo"}/>
      <Typography variant="caption">loading...</Typography>
    </Box>
  )
}

