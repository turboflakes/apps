import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NetValChartLegend({theme}) {
  return (
    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.semantics.blue }}>●</span>TVP
      </Typography>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.grey[900] }}>●</span>100% Com.
      </Typography>
      <Typography variant="caption" color="inherit">
        <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>●</span>All Others
      </Typography>
    </Box>
  );
}