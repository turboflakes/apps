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

// function valueLabelFormat(value) {
//   return `${value}`;
// }

export default function SessionSlider({maxSessions}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const {data, isSuccess: isSessionSuccess } = useGetSessionsQuery({number_last_sessions: maxSessions, show_stats: true}, {refetchOnMountOrArgChange: true});
  const historySession = useSelector(selectSessionHistory);
  
  if (!isSessionSuccess) {
    return null
  }
  let currentSession = data[data.length - 1].six;
  let defaultSession = !!historySession ? historySession : currentSession;

  const handleChange = (event, val) => {
    dispatch(sessionHistoryChanged(val))
  }

  let marks = data.map(session => {
    
    if (session.esix === 1) {
      return {
        value: session.six,
        // label: `${session.eix} // ${session.six}`
        label: session.eix
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
        mt: 1,
        p: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        // height: 72,
        // borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      {/* <Box sx={{ p:`16px 24px`, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="h6">History</Typography>
        </Box>
      </Box> */}
      <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="center">
        <Typography variant="caption">past</Typography>
        <CustomSlider
          aria-label="session slider"
          // defaultValue={defaultSession}
          value={defaultSession}
          onChange={handleChange}
          step={1}
          min={currentSession - maxSessions + 1}
          max={currentSession}
          marks={marks}
          // valueLabelFormat={valueLabelFormat}
          valueLabelDisplay="on"/>
        <Typography variant="caption">present</Typography>
      </Stack>
    </Box>
  );
}
