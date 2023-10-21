import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import { Stack } from '@mui/material';

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

const StyledIconButton = styled(IconButton)(({ theme, showDark }) => ({
  // width: 32,
  // height: 32,
  color: showDark ? theme.palette.text.secondary : theme.palette.text.primary,
  border: showDark ? `1px solid ${theme.palette.text.secondary}` : `1px solid ${theme.palette.text.primary}`, 
  borderRadius: '50%',
  backgroundColor: showDark ? theme.palette.background.secondary : theme.palette.background.primary,
  '&:hover': {
    backgroundColor: showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300],
  }
}));

export default function ValidatorDialog({ onClose, onDiscard, onNext, onBack, open, address, showDark }) {
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
  }

  const handleOnClickNext = () => {
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
      <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: theme.spacing(4), right: theme.spacing(4) }} >
        <StyledIconButton showDark={showDark} disableRipple onClick={onBack} size='small'>
          <ChevronLeftIcon fontSize="small" />
        </StyledIconButton>
        <Button sx= {{minWidth: 112, ml: theme.spacing(3)}} onClick={handleOnClose} variant='contained' color='secondary'>Done</Button>
        <Button sx={{ minWidth: 112 }} onClick={handleOnClick} color='secondary' variant='contained'
          startIcon={<SvgIcon component={isCandidate ? RemoveUserIcon : AddUserIcon} inheritViewBox />} >{isCandidate ? 'Remove' : 'Add'}</Button>
        <StyledIconButton showDark={showDark} disableRipple onClick={onNext} size='small'>
          <ChevronRightIcon fontSize="small" />
        </StyledIconButton>
      </Stack>
      { open ? <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade showSubset showDark /> : null }
      { open ? <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} noBorderRadius showDark /> : null }
    </StyledDialog>
  );
}