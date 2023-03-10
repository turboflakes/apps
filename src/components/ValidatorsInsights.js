import * as React from 'react';
import Paper from '@mui/material/Paper';
import ValidatorsDataGrid from './ValidatorsDataGrid';

export default function ValidatorsInsights({sessionIndex, skip}) {
  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '1040px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <ValidatorsDataGrid sessionIndex={sessionIndex} skip={skip} />
    </Paper>
  );
}