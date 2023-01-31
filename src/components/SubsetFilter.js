import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {
  selectSubsetFilter,
  subsetFilterChanged,
} from '../features/layout/layoutSlice'

export default function SubsetFilter() {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const subsetFilter = useSelector(selectSubsetFilter);
  
  const handleSubsetFilter = (event, newFilter) => {
    dispatch(subsetFilterChanged(newFilter))
  };

  return (
    <ToggleButtonGroup
      sx={{mx: 2}}
      value={subsetFilter}
      exclusive
      onChange={handleSubsetFilter}
      aria-label="text alignment"
    >
      <ToggleButton value="" aria-label="left aligned" sx={{ minWidth: 128}}>
        All
      </ToggleButton>
      <ToggleButton value="C100" aria-label="justified" sx={{ minWidth: 128}}>
        100% Com.
      </ToggleButton>
      <ToggleButton value="Others" aria-label="right aligned" sx={{ minWidth: 128}}>
        Others
      </ToggleButton>
      <ToggleButton value="TVP" aria-label="centered" sx={{ minWidth: 128}}>
        <b>TVP</b>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}