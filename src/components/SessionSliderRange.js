import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import isUndefined from 'lodash/isUndefined'
import isEqual from 'lodash/isEqual'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { 
  sessionHistoryRangeChanged,
  selectSessionHistoryRange,
  selectSessionHistoryIds,
  selectSessionsByIds,
} from '../features/api/sessionsSlice'

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

export default function SessionSliderRange({showCaption, isFetching}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const historySessionIds = useSelector(selectSessionHistoryIds);
  const historySessions = useSelector(state => selectSessionsByIds(state, historySessionIds));
  const historySessionRange = useSelector(selectSessionHistoryRange);
  const [sessionRange, setSessionRange] = useSessionRange(historySessionRange);

  const handleChange = (event, range) => {
    setSessionRange(range);
  }
  const handleChangeCommitted = (event, range) => {
    dispatch(sessionHistoryRangeChanged(range))
  }

  let marks = historySessions.filter(s => !isUndefined(s)).map(session => {
    
    if (session.esix === 1) {
      return {
        value: session.six,
        // label: `${session.eix} // ${session.six}`
        label: session.eix.format()
      }
    }
    
    return {
      value: session.six,
      label: ``
    }
    
  });
  
  return (
    <Box
      sx={{
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        
      }}
      >
      <Stack spacing={3} direction="row" sx={{ ml: 1, mr: 3 }} alignItems="center">
        {showCaption ? <Typography variant="caption" sx={{ ml: 3 }}>past</Typography> : null}
        <CustomSlider
          disabled={isFetching}
          value={sessionRange}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          step={1}
          min={historySessionIds[0]}
          max={historySessionIds[historySessionIds.length - 1]}
          marks={marks}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="on"/>
        {showCaption ? <Typography variant="caption">present</Typography> : null}
      </Stack>
    </Box>
  );
}
