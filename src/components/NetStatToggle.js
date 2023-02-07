import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


export default function NetStatToggle({onChange}) {
  const [value, setValue] = React.useState("total");

  const handleChange = (event, newValue) => {
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
        <ToggleButton value="total" aria-label="left aligned" sx={{ minWidth: 64}}>
          Total
        </ToggleButton>
        <ToggleButton value="avg" aria-label="justified" sx={{ minWidth: 64}}>
          Avg.
        </ToggleButton>
        <ToggleButton value="min" aria-label="right aligned" sx={{ minWidth: 64}}>
          Min.
        </ToggleButton>
        <ToggleButton value="max" aria-label="centered" sx={{ minWidth: 64}}>
          Max.
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}