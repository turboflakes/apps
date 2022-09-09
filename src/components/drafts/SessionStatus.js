import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

// import Title from './Title';

// Generate Sales Data
function createData(name, value) {
  return { name, value };
}

const data = [
  createData('done', 80),
  createData('progress', 20),
];

const COLORS = ['#343434', '#C8C9CC'];

export default function SessionStatus() {
  const theme = useTheme();

  return (
    <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          // height: 140,
          borderRadius: 3,
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
        <Typography variant="h5">Session status</Typography>
        <Typography variant="subtitle2">Val. Group 5</Typography>
        {/* <Grid container>
        <Grid item xs={12} xl={7} sx={{display: 'flex', alignItems: 'center',}}> */}
          {/* <Typography variant="h5">38</Typography> */}
          <Box>
            {/* <Box sx={{ display: 'flex', alignItems: 'flex-end'}}> */}
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">session points</Typography>
                <Typography variant="h2">38</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">core assignments</Typography>
                <Typography variant="h2">38</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
                <Typography variant="caption">authored blocks</Typography>
                <Typography variant="h2">1</Typography>
              </Box>
            {/* </Box> */}
            <Typography variant="subtitle2">480 blocks since #13,200,000</Typography>
          </Box>
    </Paper>
  );
}