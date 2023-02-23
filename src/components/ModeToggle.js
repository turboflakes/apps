import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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

export default function ModeToggle({mode}) {
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
    <ToggleButtonGroup
      value={checked}
      exclusive
      onChange={handleChange}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <FormatAlignRightIcon />
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        <FormatAlignJustifyIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
