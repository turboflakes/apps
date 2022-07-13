import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ValBackingPieChart from './ValBackingPieChart';

export default function ValGroupPieCharts({data}) {
  return (
    <Paper sx={{ p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 200,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">Attestations of validity</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        {data.map((o, i) => 
          (<ValBackingPieChart key={i} data={o} />)
        )}
      </Box>
    </Paper>
  );
}