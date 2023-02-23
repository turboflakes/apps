import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';
import InputAdornment from '@mui/material/InputAdornment';

import {
  selectIdentityFilter,
  identityFilterChanged,
} from '../features/layout/layoutSlice'

export default function SubsetFilter() {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const identityFilter = useSelector(selectIdentityFilter);
  
  const handleIdentityFilter = (event) => {
    dispatch(identityFilterChanged(event.target.value))
  }

  return (
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
        startAdornment: (
          <InputAdornment position="start">
            <IconButton sx={{ ml: 1}} size="small"
              // disabled={!isValidAddress(this.state.address)}
              >
              <SortIcon />
            </IconButton>
          </InputAdornment>
        ),
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
  );
}