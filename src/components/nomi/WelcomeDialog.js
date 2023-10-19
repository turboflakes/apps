import * as React from 'react';
import { useSelector } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WelcomeStepper from './WelcomeStepper';

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

export default function WelcomeDialog({ onClose, open }) {
  const theme = useTheme();
  
  const handleClose = () => {
    onClose();
  };

  return (
    <StyledDialog onClose={handleClose} open={open} fullWidth={true} maxWidth={"lg"} keepMounted>
        <DialogContent>
          <WelcomeStepper onClose={handleClose} />
        </DialogContent>
    </StyledDialog>
  );
}