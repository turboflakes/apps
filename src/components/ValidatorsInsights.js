import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import ValidatorsDataGrid from './ValidatorsDataGrid';
import IdentityFilter from './IdentityFilter';
import SubsetFilter from './SubsetFilter';

export default function ValidatorsInsights({sessionIndex, skip}) {
  // const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '1080px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: "flex", alignItems: "center"}} >
          <IdentityFilter />
          {/* <SubsetFilter /> */}
        </Box>
        <ValidatorsDataGrid sessionIndex={sessionIndex} skip={skip} />
    </Paper>
  );
}