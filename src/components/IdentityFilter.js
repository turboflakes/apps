import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import TextField from '@mui/material/TextField';

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