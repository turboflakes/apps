import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import isUndefined from 'lodash/isUndefined'
import isEqual from 'lodash/isEqual'
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

function valueLabelFormat(value) {
  return value.format();
}

function useSessionRange(range) {
  const [value, setValue] = React.useState(range);

  React.useEffect(() => {
    if (!isEqual(value, range)) {
      setValue(range);
    }
  }, [range]);

  return [value, setValue];
}

export default function FilterSliderRange() {
  // const theme = useTheme();
  const dispatch = useDispatch();
  // const [filterRange, setFilterRange] = useSessionRange([10, 30]);
  const [filterRange, setFilterRange] = React.useState([10, 30]);

  const handleChange = (event, range) => {
    setFilterRange(range);
  }
  const handleChangeCommitted = (event, range) => {
    // dispatch(sessionHistoryRangeChanged(range))
  }

  let marks = [
    {
      value: 10,
      label: ''
    },
    {
      value: 20,
      label: ''
    },
    {
      value: 30,
      label: ''
    },
    {
      value: 40,
      label: ''
    }
  ]

  const showCaption = false
  
  return (
    <Box
      sx={{
        mt: 1,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        
      }}
      >
      <Stack spacing={3} direction="row" sx={{ ml: 1, mr: 3 }} alignItems="center">
        {showCaption ? <Typography variant="caption" sx={{ ml: 3 }}>past</Typography> : null}
        <CustomSlider
          value={filterRange}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          step={1}
          min={0}
          max={50}
          // marks={marks}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="on"/>
        {showCaption ? <Typography variant="caption">present</Typography> : null}
      </Stack>
    </Box>
  );
}
