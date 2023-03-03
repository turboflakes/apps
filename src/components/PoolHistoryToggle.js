import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
import isNull from 'lodash/isNull';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export default function PoolHistoryToggle({onChange}) {
  // const theme = useTheme();
  const [value, setValue] = React.useState("members");

  const handleChange = (event, newValue) => {
    if (isNull(newValue)) {
      return
    }
    setValue(newValue)
    onChange(newValue)
  };

  return (
    <Box sx={{ mb: 1}}>
      <ToggleButtonGroup
        size="small"
        sx={{mx: 2}}
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
      >
        <ToggleButton value="members" aria-label="left aligned" 
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
          members
        </ToggleButton>
        <ToggleButton value="staked" aria-label="justified" 
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
          staked
        </ToggleButton>
        <ToggleButton value="reward" aria-label="centered" 
          sx={{ minWidth: 48, mr: 0, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
          rewards
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}