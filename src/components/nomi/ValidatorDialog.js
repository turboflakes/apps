import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SvgIcon from '@mui/material/SvgIcon';
import ValAddressProfile from '../ValAddressProfile';
import ValidatorSessionHistoryTimelineChart from '../ValidatorSessionHistoryTimelineChart';
import { ReactComponent as AddUserIcon } from '../../assets/polkadot_icons/add_user.svg';
import { ReactComponent as RemoveUserIcon } from '../../assets/polkadot_icons/remove_user.svg';
import {
  selectMaxHistorySessions,
} from '../../features/layout/layoutSlice';
import {
  candidateAdded,
  candidateRemoved,
  selectIsCandidate
} from '../../features/api/boardsSlice';

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
  const dispatch = useDispatch();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const isCandidate = useSelector((state) => selectIsCandidate(state, address));

  const handleOnClose = () => {
    onClose();
  };

  const handleOnClick = () => {
    if (isCandidate) {
      dispatch(candidateRemoved(address))
    } else {
      dispatch(candidateAdded(address))
    }
    onClose()
  }

  if (!address) {
    return null
  }

  return (
    <StyledDialog onClose={handleOnClose} open={open} fullWidth={true} maxWidth={"lg"} keepMounted>
      <Box sx={{ position: 'absolute', top: theme.spacing(4), right: theme.spacing(4) }} >
        <Button onClick={handleOnClick} variant='contained' color='secondary' 
          startIcon={<SvgIcon component={isCandidate ? RemoveUserIcon : AddUserIcon} inheritViewBox />}>{isCandidate ? 'Remove' : 'Add'}</Button>
        {/* <Button sx= {{ml: theme.spacing(3)}} onClick={handleOnClose} variant='contained' color='secondary'>Done</Button> */}
      </Box>
      { open ? <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade showSubset showDark /> : null }
      { open ? <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} noBorderRadius showDark /> : null }
    </StyledDialog>
  );
}