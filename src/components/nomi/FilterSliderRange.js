import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';


const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#000',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
    },
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: '0px 0px 0px 8px rgb(0 0 0 / 16%)',
    },
    '&.Mui-active': {
      width: 20,
      height: 20,
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    // color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
      fontWeight: '600'
    },
  },
  '& .MuiSlider-markLabel': {
    color: '#bfbfbf',
    '&.MuiSlider-markLabelActive': {
      color: theme.palette.text.primary,
      fontWeight: '600'
    },
  },
}));

export default function FilterSliderRange({limits, labelFormat, step, showCaption, onChange}) {
  const theme = useTheme();
  const [filterRange, setFilterRange] = React.useState([limits[0], limits[1]]);

  const handleChange = (event, range) => {
    setFilterRange(range);
  }
  const handleChangeCommitted = (event, range) => {
    onChange(event, range)
  }

  // let marks = [
  //   {
  //     value: 10,
  //     label: ''
  //   },
  //   {
  //     value: 20,
  //     label: ''
  //   },
  //   {
  //     value: 30,
  //     label: ''
  //   },
  //   {
  //     value: 40,
  //     label: ''
  //   }
  // ]

  if (!limits) {
    return null
  }
  
  return (
    <Box
      sx={{
        mt: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        
      }}
      >
      <Stack spacing={1} direction="row" sx={{ mx: theme.spacing(1) }} alignItems="center">
        {showCaption ? <Typography variant="caption" sx={{ ml: 3 }}>low</Typography> : null}
        <CustomSlider
          value={filterRange}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          step={!!step ? step : 1}
          min={limits[0]}
          max={limits[1]}
          // marks={marks}
          valueLabelFormat={labelFormat}
          valueLabelDisplay="on"/>
        {showCaption ? <Typography variant="caption" sx={{ ml: 3 }}>high</Typography> : null}
      </Stack>
    </Box>
  );
}
