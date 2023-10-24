import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NominationDialog from './NominationDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Identicon from '@polkadot/react-identicon';
import { ReactComponent as NominationIcon } from '../../assets/polkadot_icons/nominating_white.svg';
import {
  selectValProfileByAddress,
  useGetValidatorProfileByAddressQuery
} from '../../features/api/valProfilesSlice';
import {
  selectCandidates
} from '../../features/api/boardsSlice';
import {
  selectChain,
  selectChainInfo
} from '../../features/chain/chainSlice';
import { stashDisplay, nameDisplay } from '../../util/display';
import { chainAddress } from '../../util/crypto';
import { getMaxValidators } from '../../constants';

function CandidateChip({stash, onClick}) {
  const theme = useTheme();
  useGetValidatorProfileByAddressQuery(stash);
  const chainInfo = useSelector(selectChainInfo)
  const valProfile = useSelector(state => selectValProfileByAddress(state, stash));

  return (
    <Chip sx={{ 
      '&:hover': { bgcolor: theme.palette.neutrals[100], opacity: 1 }, 
      bgcolor: theme.palette.neutrals[200], opacity: 0.8, 
      mb: theme.spacing(1), width: 128, justifyContent: 'flex-start'}} 
      onClick={() => onClick(stash)}
      label={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(chainAddress(stash, chainInfo.ss58Format), 4), 12)} 
      icon={<Identicon value={stash} size={24} theme={'polkadot'} />} 
    />
  )
}

export default function NominationBox({api, left, onClick, onAddAllClick }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const selectedChain = useSelector(selectChain);
  const candidates = useSelector(selectCandidates);
  
  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
      <Box sx={{ 
        position: 'absolute', 
        top: 96,
        transition: theme.transitions.create(['left'], {
          duration: theme.transitions.duration.standard,
        }),
        left,
        zIndex: 1
      }}>
        <Stack direction="column" sx={{ width: 145 }}>
          <Typography variant='h6' paragraph>
            Candidates
            {candidates.length > 0 ?
              <Box component="span" sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: theme.palette.background.secondary, width: 28, height: 28, borderRadius: '50%',
                color: theme.palette.text.secondary,
                display: 'center',
                alignItems: 'center',
                justifyContent: 'center'
                }}><Typography variant='caption' color="secondary">{candidates.length}</Typography>
              </Box> : null }
          </Typography>
          <Button sx={{mb: theme.spacing(1)}} onClick={onAddAllClick} align="flex-start" variant='contained'>
            {`Add Top ${getMaxValidators(selectedChain)}`}
          </Button>
          {candidates.length > 0 ?
            <Button sx={{mb: theme.spacing(1)}} onClick={handleOpenDialog} startIcon={<NominationIcon />} variant='contained'>
              {/* <Box component="span" sx={{ 
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  backgroundColor: theme.palette.semantics.red, width: 28, height: 28, borderRadius: '50%',
                  color: theme.palette.text.secondary,
                  display: 'center',
                  alignItems: 'center',
                  justifyContent: 'center'
                  }}><Typography variant='caption' color="secondary">{candidates.length}</Typography>
                  </Box> */}
              Nominate
            </Button> : null}
          <Box sx={{
            maxHeight: window.innerHeight * 0.6,
            overflowY: 'auto',
            overflowX: 'hidden',
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            width: 144
          }}>
          {candidates.map((value, index) => (<CandidateChip key={index} stash={value} onClick={onClick} />))}
          </Box>
        </Stack>
        { open ?
            <NominationDialog
            api={api}
            open={open}
            onClose={handleCloseDialog}
          /> : null}
      </Box>
  );
}