import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PoolNomineesList from './PoolNomineesList';
import PoolActiveNomineesList from './PoolActiveNomineesList';

import {
  selectPoolById,
} from '../features/api/poolsMetadataSlice';

export default function PoolNomineesCardList({sessionIndex, poolId}) {
  const pool = useSelector(state => selectPoolById(state, poolId));
  const nominees = !isUndefined(pool.nomstats) ? pool.nomstats.nominees : 0;
  const active = !isUndefined(pool.nomstats) ? pool.nomstats.active : 0;
  const [value, setValue] = React.useState("active");

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
      <Box sx={{mb: 1}}>
        <ToggleButtonGroup
          size="small"
          sx={{mx: 2}}
          value={value}
          exclusive
          onChange={handleChange}
          aria-label="text alignment"
        >
          <ToggleButton value="active" aria-label="left aligned" 
            sx={{ minWidth: 64, mr: 1, border: 0, 
              fontSize: "0.625rem",
              '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
              '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
            active: {active}
          </ToggleButton>
          <ToggleButton value="Destroying" aria-label="centered" 
            sx={{ minWidth: 64, mr: 1, border: 0, 
              fontSize: "0.625rem",
              '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
              '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            nominees: {nominees}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
        {value === "active" ? 
          <PoolActiveNomineesList sessionIndex={sessionIndex} poolId={poolId} /> :
          <PoolNomineesList sessionIndex={sessionIndex} poolId={poolId} />
        }
    </Box>
  );
}