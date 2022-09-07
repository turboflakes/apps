import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { 
  useGetSessionsQuery, 
  sessionHistoryChanged,
  selectSessionHistory,
 } from '../features/api/sessionsSlice'

// TODO add a maximum of 6*4*2 = 48 sessions? kusama
const MAX_SESSIONS = 48;

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: '#000',
  height: 2,
  padding: '15px 0',
  // '& .MuiSlider-thumb': {
  //   height: 28,
  //   width: 28,
  //   backgroundColor: '#fff',
  //   boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  //   '&:focus, &:hover, &.Mui-active': {
  //     boxShadow:
  //       'rgba(149, 157, 165, 0.6) 0px 8px 24px',
  //     // Reset on touch devices, it doesn't add specificity
  //     '@media (hover: none)': {
  //       boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  //     },
  //   },
  // },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
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

export default function SessionSlider() {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const {data, isSuccess: isSessionSuccess } = useGetSessionsQuery({max: MAX_SESSIONS}, {refetchOnMountOrArgChange: true});
  const historySession = useSelector(selectSessionHistory);
  if (!isSessionSuccess) {
    return null
  }
  let currentSession = data[data.length - 1].six;
  let defaultSession = !!historySession ? historySession : currentSession;

  const handleChange = (event, val) => {
    dispatch(sessionHistoryChanged(val));
  }

  let marks = data.map(session => {

    if (session.esix === 1) {
      return {
        value: session.six,
        label: `${session.eix} // ${session.six}`
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
        mt:3,
        p: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        // height: 112,
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
          defaultValue={defaultSession}
          onChangeCommitted={handleChange}
          step={1}
          min={currentSession - MAX_SESSIONS}
          max={currentSession}
          marks={marks}
          valueLabelDisplay="on"/>
        <Typography variant="caption">present</Typography>
      </Stack>
    </Box>
  );
}
