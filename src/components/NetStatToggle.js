import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
import isNull from 'lodash/isNull';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export default function NetStatToggle({onChange}) {
  // const theme = useTheme();
  const [value, setValue] = React.useState("total");

  const handleChange = (event, newValue) => {
    if (isNull(newValue)) {
      return
    }
    setValue(newValue)
    onChange(newValue)
  };

  return (
    <Box>
      <ToggleButtonGroup
        size="small"
        sx={{mx: 2}}
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
      >
        <ToggleButton value="total" aria-label="left aligned" 
          disableRipple
          disableFocusRipple
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
          Total
        </ToggleButton>
        <ToggleButton value="avg" aria-label="justified" 
          disableRipple
          disableFocusRipple
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
          Avg.
        </ToggleButton>
        <ToggleButton value="min" aria-label="right aligned" 
          disableRipple
          disableFocusRipple
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
          Min.
        </ToggleButton>
        <ToggleButton value="max" aria-label="centered" 
          disableRipple
          disableFocusRipple
          sx={{ minWidth: 48, mr: 1, border: 0, 
            fontSize: "0.625rem",
            '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
            '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
          Max.
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}