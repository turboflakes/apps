import * as React from 'react';
import { useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import ValAddressProfile from '../ValAddressProfile';
import ValidatorSessionHistoryTimelineChart from '../ValidatorSessionHistoryTimelineChart';
import {
  selectMaxHistorySessions,
} from '../../features/layout/layoutSlice';

{/* <span key={v} style={{ width: '4px', height: '4px', borderRadius: '50%', margin: 0.5,
              backgroundColor: theme.palette.secondary.main, 
              display: "inline-block" }}>
            </span> */}

const StyledDialog = styled(Dialog)(({ theme, maxWidth }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0),
    backgroundColor: theme.palette.primary.main,
    height: '648px',
    display: 'flex',
    justifyContent: 'space-between'
  },
}));

export default function ValidatorDialog({ onClose, selectedValue, open, address }) {
  const theme = useTheme();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  if (!address) {
    return null
  }

  return (
    <StyledDialog onClose={handleClose} open={open} fullWidth={true} maxWidth={"lg"} keepMounted>
      { open ? <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade showSubset showDark /> : null }
      { open ? 
        <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} noBorderRadius /> : null
        // <Skeleton sx={{
        //   bgcolor: theme.palette.text.secondary,
        //   width: '100%',
        //   height: 390,
        // }} />
        }
    </StyledDialog>
  );
}