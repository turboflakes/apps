import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import {
  useGetSessionsQuery,
  sessionHistoryChanged,
  selectSessionHistory,
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
    fontWeight: '600',
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
    fontSize: 12,
    color: '#bfbfbf',
    '&.MuiSlider-markLabelActive': {
      color: theme.palette.text.primary,
    },
  },
}));

function valueLabelFormat(value) {
  return value.format();
}

function useSessionIndex(sessionIndex) {
  const [value, setValue] = React.useState(sessionIndex);

  React.useEffect(() => {
    setValue((current) => (current !== sessionIndex ? sessionIndex : current));
  }, [sessionIndex]);

  return [value, setValue];
}

export default function SessionSlider({maxSessions, showLegend}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const {data, isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, stats: true}, {refetchOnMountOrArgChange: true});
  const historySession = useSelector(selectSessionHistory);
  const [sessionIndex, setSessionIndex] = useSessionIndex(historySession);

  if (!isSessionSuccess) {
    return null
  }

  let currentSession = data[data.length - 1].six;

  const handleChange = (event, value) => {
    setSessionIndex(value);
  }
  const handleChangeCommitted = (event, value) => {
    dispatch(sessionHistoryChanged(value))
  }

  let marks = data.map(session => {

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
      <Stack spacing={3} direction="row"
        sx={{ mb: 1, ml: !showLegend ? 6 : 0, mr: !showLegend ? 6 : 0 }} alignItems="center">
        {showLegend ? <Typography variant="caption" sx={{ ml: 3 }}>past</Typography> : null}
        <CustomSlider
          // defaultValue={sessionIndex}
          value={sessionIndex}
          // no filled track, only the selected session is highlighted
          track={false}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommitted}
          step={1}
          min={currentSession - maxSessions + 1}
          max={currentSession}
          marks={marks}
          valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="on"/>
        {showLegend ? <Typography variant="caption">present</Typography> : null}
      </Stack>
    </Box>
  );
}
