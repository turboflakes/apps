import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ValidatorsHistoryDataGrid from './ValidatorsHistoryDataGrid';

export default function ValidatorsHistoryInsights({sessionIndex, skip}) {
  // const theme = useTheme();
  const [identityFilter, setIdentityFilter] = React.useState("");
  
  const handleChange = (event) => {
    setIdentityFilter(event.target.value)
  }

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
            <Typography variant="subtitle2">Para-Authorities at session {sessionIndex}</Typography>
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
            onChange={handleChange}
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
        </form>
        <ValidatorsHistoryDataGrid sessionIndex={sessionIndex} skip={skip} identityFilter={identityFilter} />
    </Paper>
  );
}