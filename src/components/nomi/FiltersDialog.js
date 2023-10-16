import * as React from 'react';
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


const filtersDescription = ["Active Validators", "TVP Validators", "Over Subscribed", "Missing Identity"];

export default function FiltersDialog(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [filters, setFilters] = React.useState(props.filters);
  
  const handleCancel = () => {
    setFilters(props.filters)
    onClose();
  };

  const handleDone = () => {
    onClose(filters);
  };

  const handleChange = (event, index) => {
    let newChecked = [...filters];
    if (newChecked[index] === 0) { 
      newChecked[index] = 1;
    } else {
      newChecked[index] = 0;
    }
    setFilters(newChecked)
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Filter Validators</DialogTitle>
      <DialogContent>
        <List
          disablePadding
          subheader={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <ListSubheader color='primary'>Include:</ListSubheader>
            </Box>
          }
        >
          {filters.slice(0, 2).map((value, index) => {
            return (
              <ListItem
                key={index}
              >
                <Chip label={filtersDescription[index]} icon={value ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />} variant="outlined" 
                  onClick={(e) => handleChange(e, index)} />
              </ListItem>
            );
          })}
        </List>
        <List
          disablePadding
          subheader={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <ListSubheader color='primary'>Exclude:</ListSubheader>
            </Box>
          }
        >
          {filters.slice(2, 4).map((value, index) => {
            return (
              <ListItem
                key={index}
              >
                <Chip label={filtersDescription[index + 2]} icon={value ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />} variant="outlined" 
                  onClick={(e) => handleChange(e, index + 2)} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleDone}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
