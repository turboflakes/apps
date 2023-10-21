import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import NominationDialog from './NominationDialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Identicon from '@polkadot/react-identicon';
import { ReactComponent as NominationIcon } from '../../assets/polkadot_icons/nominating.svg';
import {
  selectCandidates
} from '../../features/api/boardsSlice';

export default function NominationFab({left, onClick }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
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
      <Stack direction="column">
        <Fab sx={{ mb: theme.spacing(2)}} onClick={handleOpenDialog} size="large" color="primary" aria-label="nominating">
          {candidates.length > 0 ?
            <Box component="span" sx={{ 
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: theme.palette.semantics.red, width: 28, height: 28, borderRadius: '50%',
                color: theme.palette.text.secondary,
                display: 'center',
                alignItems: 'center',
                justifyContent: 'center'
                }}><Typography variant='caption' color="secondary">{candidates.length}</Typography>
                </Box> : null }
          <NominationIcon />
        </Fab>
        {candidates.map((value, index) => 
          (<Chip key={index} sx={{ mb: theme.spacing(1), minWidth: 128, justifyContent: 'flex-start'}} onClick={() => onClick(value)}
            label={value} 
            icon={<Identicon value={value} size={24} theme={'polkadot'} />} 
          />))}
      </Stack>
      <NominationDialog
          open={open}
          onClose={handleCloseDialog}    
        />
    </Box>
  );
}