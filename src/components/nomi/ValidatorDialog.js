import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SvgIcon from '@mui/material/SvgIcon';
import ValAddressProfile from '../ValAddressProfile';
import ValAuthoredBlocksHistoryBox from '../ValAuthoredBlocksHistoryBox';
import ValMvrHistoryBox from '../ValMvrHistoryBox';
import ValEraPointsHistoryBox from '../ValEraPointsHistoryBox';
import ValInclusionBox from '../ValInclusionBox';
import ValidatorSessionHistoryTimelineChart from '../ValidatorSessionHistoryTimelineChart';
import { ReactComponent as AddUserIcon } from '../../assets/polkadot_icons/add_user.svg';
import { ReactComponent as RemoveUserIcon } from '../../assets/polkadot_icons/remove_user.svg';
import {
  selectCandidates
} from '../../features/api/boardsSlice';
import {
  selectMaxHistorySessions,
} from '../../features/layout/layoutSlice';
import {
  selectChain,
  selectAddress,
  addressChanged
} from '../../features/chain/chainSlice';
import {
  candidateAdded,
  candidateRemoved,
  selectIsCandidate
} from '../../features/api/boardsSlice';
import { Stack } from '@mui/material';
import { getMaxValidators } from '../../constants';

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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32,
    color: theme.palette.text.secondary,
    border: `1px solid ${theme.palette.text.primary}`, 
    backgroundColor: theme.palette.background.secondary,
    '&:hover': {
      backgroundColor: theme.palette.neutrals[300],
    }
}));

export default function ValidatorDialog({ onClose, onDiscard, onNext, onBack, open, address, showDark }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const selectedChain = useSelector(selectChain);
  const isCandidate = useSelector((state) => selectIsCandidate(state, address));
  const candidates = useSelector(selectCandidates);

  const handleOnClose = () => {
    onClose();
  };

  const handleOnClick = () => {
    if (isCandidate) {
      dispatch(candidateRemoved(address))
    } else {
      if (candidates.length < getMaxValidators(selectedChain)) {
        dispatch(candidateAdded(address))
      }
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
        <Button sx= {{minWidth: 112, ml: theme.spacing(3)}} onClick={handleOnClose} variant='outlined' color='secondary'>Done</Button>
        <Button sx={{ minWidth: 112 }} onClick={handleOnClick} color='secondary' variant='contained'
          disabled={candidates.length === getMaxValidators(selectedChain) && !isCandidate}
          startIcon={<SvgIcon component={isCandidate ? RemoveUserIcon : AddUserIcon} inheritViewBox />} >{isCandidate ? 'Remove' : 'Add'}</Button>
        <StyledIconButton showDark={showDark} disableRipple onClick={onNext} size='small'>
          <ChevronRightIcon fontSize="small" />
        </StyledIconButton>
      </Stack>
      { open ? 
        <Box sx={{ display: 'flex' }} >
          <ValAddressProfile address={address} maxSessions={maxHistorySessions} showGrade showSubset showDark />
          <Box sx={{ height: 288, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <ValMvrHistoryBox address={address} maxSessions={maxHistorySessions} showDark={showDark} noChart={true} />
            <ValEraPointsHistoryBox address={address} maxSessions={maxHistorySessions} showDark={showDark} noChart={true} />
            <ValAuthoredBlocksHistoryBox address={address} maxSessions={maxHistorySessions} showDark={showDark} noChart={true} />
            <ValInclusionBox address={address} maxSessions={maxHistorySessions} showDark={showDark} />
          </Box>
        </Box> : null }
      { open ? <ValidatorSessionHistoryTimelineChart address={address} maxSessions={maxHistorySessions} noBorderRadius showDark noDots /> : null }
    </StyledDialog>
  );
}