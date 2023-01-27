import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/PlaylistAdd';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ValidatorsHistoryDataGrid from './ValidatorsHistoryDataGrid';
import Spinner from './Spinner';

import {
  useGetValidatorsQuery,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice'

export default function ValidatorsHistoryInsights({sessionIndex, skip}) {
  // const theme = useTheme();
  const [identityFilter, setIdentityFilter] = React.useState('');
  const [subsetFilter, setSubsetFilter] = React.useState('');
  const [maxSessions, setMaxSessions] = React.useState(6);
  const historySessionIds = buildSessionIdsArrayHelper(sessionIndex, maxSessions);
  const {isSuccess, isFetching} = useGetValidatorsQuery({sessions: [historySessionIds[0], historySessionIds[5]].join(","), show_summary: true, show_profile: true}, {skip});

  // if (!isSuccess) {
  //   return null
  // }
  
  const handleIdentityFilter = (event) => {
    setIdentityFilter(event.target.value)
  }

  const handleSubsetFilter = (event, newFilter) => {
    setSubsetFilter(newFilter);
  };

  const handleLoadTimeline = (event) => {
    setMaxSessions(maxSessions + 6)
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
            <Typography variant="subtitle2">Selected to para-validate in the last {historySessionIds.length} sessions</Typography>
          </Box>
          <Box>
          {isFetching ? <Spinner /> : null}
          </Box>
        </Box>

        <form style={{ display: "flex", alignItems: "center", justifyContent: 'space-between'}} 
          noValidate autoComplete="off">
          <Box>
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
          </Box>
          <Button variant='contained' endIcon={<AddIcon />} onClick={handleLoadTimeline}
            disabled={isFetching} disableRipple>
            Load more sessions
          </Button>
        </form>
        <ValidatorsHistoryDataGrid sessionIndex={sessionIndex} skip={skip} 
          identityFilter={identityFilter} subsetFilter={subsetFilter}
          maxSessions={maxSessions} isFetching={isFetching} />
    </Paper>
  );
}