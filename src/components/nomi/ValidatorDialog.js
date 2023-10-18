import * as React from 'react';
import { useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import ValAddressProfile from '../ValAddressProfile';
import ValidatorSessionHistoryTimelineChart from '../ValidatorSessionHistoryTimelineChart';
import {
  selectMaxHistorySessions,
} from '../../features/layout/layoutSlice';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0),
    backgroundColor: theme.palette.primary.main,
    height: '648px',
    display: 'flex',
    justifyContent: 'space-between'
  },
}));

export default function ValidatorDialog({ onClose, open, address }) {
  const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);

  const handleClose = () => {
    onClose();
  };

  if (!address) {
    return null
  }

  console.log("__ValidatorDialog");
  return (
    <StyledDialog onClose={handleClose} open={open} fullWidth={true} maxWidth={"lg"} keepMounted>
      { open ? <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade showSubset showDark /> : null }
      { open ? <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} noBorderRadius /> : null }
    </StyledDialog>
  );
}