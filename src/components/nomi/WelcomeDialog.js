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
        <Box sx={{ mt: theme.spacing(2) }}>
        <Typography variant="h1" color='secondary' align='center'>WELCOME TO NOMI</Typography>
        <Typography variant="subtitle1" color='secondary' align='center'>Craft your own criteria to better suit your nominations</Typography>
        </Box>
        <DialogContent>
          <WelcomeStepper />
        </DialogContent>
    </StyledDialog>
  );
}