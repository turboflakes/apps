import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import HistoryErasMenu from './HistoryErasMenu';
import {
  modeChanged,
  selectIsLiveMode
} from '../features/layout/layoutSlice';
import { 
  selectBlock,
 } from '../features/api/blocksSlice'
import { 
  selectSessionHistory,
  selectSessionCurrent,
  selectSessionByIndex,
  sessionHistoryChanged,
 } from '../features/api/sessionsSlice';

const label = { inputProps: { 'aria-label': 'Mode switch' } };

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 640 512"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M319.1 351.1c-35.35 0-64 28.66-64 64.01s28.66 64.01 64 64.01c35.34 0 64-28.66 64-64.01S355.3 351.1 319.1 351.1zM320 191.1c-70.25 0-137.9 25.6-190.5 72.03C116.3 275.7 115 295.9 126.7 309.2C138.5 322.4 158.7 323.7 171.9 312C212.8 275.9 265.4 256 320 256s107.3 19.88 148.1 56C474.2 317.4 481.8 320 489.3 320c8.844 0 17.66-3.656 24-10.81C525 295.9 523.8 275.7 510.5 264C457.9 217.6 390.3 191.1 320 191.1zM630.2 156.7C546.3 76.28 436.2 32 320 32S93.69 76.28 9.844 156.7c-12.75 12.25-13.16 32.5-.9375 45.25c12.22 12.78 32.47 13.12 45.25 .9375C125.1 133.1 220.4 96 320 96s193.1 37.97 265.8 106.9C592.1 208.8 600 211.8 608 211.8c8.406 0 16.81-3.281 23.09-9.844C643.3 189.2 642.9 168.1 630.2 156.7z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.neutrals[300] : theme.palette.neutrals[200],
        backgroundColor: theme.palette.semantics.green,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.text.primary,
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    width: "100px",
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.neutrals[300] : theme.palette.neutrals[200],
    borderRadius: 20 / 2,
  },
}));

export default function ModeSwitch({mode}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(mode === 'Live');
  const block = useSelector(selectBlock);
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex));

  if (isUndefined(block) || isUndefined(session)) {
    return null
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setTimeout(() => {
      dispatch(modeChanged(event.target.checked ? 'Live' : 'History'));
      if (!event.target.checked) {
        dispatch(sessionHistoryChanged(currentSession - 1))
      }
    }, 100);
  };

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      {isLiveMode ? 
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', 
                  animation: "pulse 1s infinite ease-in-out alternate",
                  backgroundColor: theme.palette.semantics.green, 
                  display: "inline-block" }}></span>
          <Typography variant="caption" sx={{ ml: 1, fontWeight: '600' }} color="textPrimary">
            {`${mode} [ ${session.eix.format()} // ${session.six.format()} ]`}
          </Typography>
        </Box> : 
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <HistoryErasMenu />
          <Typography variant="caption" sx={{ ml: 1, fontWeight: '600' }} color="textPrimary">
            {`[ ${session.eix.format()} // ${session.six.format()} ]`}
          </Typography>
        </Box>
      }
      <MaterialUISwitch {...label} 
        checked={checked}
        onChange={handleChange} />
    </Stack>
  );
}
