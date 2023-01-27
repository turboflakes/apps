import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ValidatorsDataGrid from './ValidatorsDataGrid';

export default function ValidatorsInsights({sessionIndex, skip}) {
  // const theme = useTheme();
  const [identityFilter, setIdentityFilter] = React.useState('');
  const [subsetFilter, setSubsetFilter] = React.useState('');
  
  const handleIdentityFilter = (event) => {
    setIdentityFilter(event.target.value)
  }

  const handleSubsetFilter = (event, newFilter) => {
   setSubsetFilter(newFilter);
  };

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '1104px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6">Validators</Typography>
            <Typography variant="subtitle2">Selected to para-validate in the current session ({sessionIndex})</Typography>
          </Box>
        </Box>

        <form style={{ display: "flex", alignItems: "center"}} 
          noValidate autoComplete="off">
          <TextField
            sx={{
              // backgroundColor: theme.palette.neutrals[100],
              borderRadius: 30,
              width: 512
            }}
            variant="outlined"
            placeholder="Filter by Identity or Address"
            color="primary"
            value={identityFilter}
            onChange={handleIdentityFilter}
            size="small"
            fullWidth
            InputProps={{
              sx: {
                borderRadius: 30,
                paddingLeft: '4px',
                '> .MuiOutlinedInput-input': {
                  fontSize: "0.925rem",
                  height: "24px",
                  // fontSize: "0.825rem",
                  // lineHeight: "1rem",
                },
              }
            }}
          />
        
          {/* subset filter */}
          <ToggleButtonGroup
            sx={{mx: 2}}
            value={subsetFilter}
            exclusive
            onChange={handleSubsetFilter}
            aria-label="text alignment"
          >
            <ToggleButton value="" aria-label="left aligned">
              All
            </ToggleButton>
            <ToggleButton value="C100%" aria-label="justified">
              100% Commission
            </ToggleButton>
            <ToggleButton value="Others" aria-label="right aligned">
              Others
            </ToggleButton>
            <ToggleButton value="TVP" aria-label="centered">
              <b>TVP</b>
            </ToggleButton>
          </ToggleButtonGroup>
        </form>
        <ValidatorsDataGrid sessionIndex={sessionIndex} skip={skip} 
          identityFilter={identityFilter} subsetFilter={subsetFilter} />
    </Paper>
  );
}