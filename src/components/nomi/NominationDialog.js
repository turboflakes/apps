import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


const optionsDescription = ["Active Validators", "TVP Validators", "Over Subscribed", "Missing Identity"];

const StyledDialog = styled(Dialog)(({ theme, maxWidth }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0),
    backgroundColor: theme.palette.primary.main,
    maxHeight: 435,
  },
}));

export default function FiltersDialog({ onClose, open, ...other }) {
  const theme = useTheme();
  const [options, setOptions] = React.useState();
  
  const handleCancel = () => {
    // setOptions(filters)
    onClose();
  };

  const handleDone = () => {
    onClose(options);
  };

  const handleChange = (event, index) => {
    let newChecked = [...options];
    if (newChecked[index] === 0) { 
      newChecked[index] = 1;
    } else {
      newChecked[index] = 0;
    }
    setOptions(newChecked)
  };

  return (
    <StyledDialog fullWidth={true} maxWidth="xs" open={open} onClose={handleCancel} keepMounted>
      {/* <Box sx={{
        m: 0,
        p: 0,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <DialogTitle sx={{ color: theme.palette.text.secondary }} >Filter Validators</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} variant='outlined' color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleDone} variant='contained' color='secondary' >Done</Button>
        </DialogActions>
      </Box>
      <DialogContent>
        <List
          disablePadding
          subheader={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <ListSubheader sx={{ bgcolor: 'transparent' }}>Only Include:</ListSubheader>
            </Box>
          }
        >
          {options.slice(0, 2).map((value, index) => {
            return (
              <ListItem
                key={index}
              >
                <Chip label={optionsDescription[index]} icon={value ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />} variant="outlined" 
                  onClick={(e) => handleChange(e, index)} color='secondary' />
              </ListItem>
            );
          })}
        </List>
        <List
          disablePadding
          subheader={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <ListSubheader sx={{ bgcolor: 'transparent' }} >Exclude:</ListSubheader>
            </Box>
          }
        >
          {options.slice(2, 4).map((value, index) => {
            return (
              <ListItem
                key={index}
              >
                <Chip label={optionsDescription[index + 2]} icon={value ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />} variant="outlined" 
                  onClick={(e) => handleChange(e, index + 2)} color='secondary' />
              </ListItem>
            );
          })}
        </List>
      </DialogContent> */}
      {/* <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleDone} variant='contained'>Done</Button>
      </DialogActions> */}
    </StyledDialog>
  );
}
