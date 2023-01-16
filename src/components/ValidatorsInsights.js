import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Identicon from '@polkadot/react-identicon';
import ValidatorsDataGrid from './ValidatorsDataGrid';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'


export default function ValidatorsInsights({sessionIndex, skip}) {
  const theme = useTheme();
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
        height: '1360px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" paragraph>Insights</Typography>
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
            placeholder="Filter by validator identity"
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
        <ValidatorsDataGrid sessionIndex={sessionIndex} skip={skip} identityFilter={identityFilter} />
    </Paper>
  );
}