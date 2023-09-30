import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ClearIcon from '@mui/icons-material/Clear';
import Popover from '@mui/material/Popover';

export default function PopoverInfo({children}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  
  return (
    <span sx={{
        color: theme.palette.text.secondary
      }}>
        <IconButton
          aria-describedby={open ? 'popover-info' : undefined}
          onClick={handleClick}
          sx={{
            color: theme.palette.text.secondary,
            padding: theme.spacing(1),
            marginLeft: -theme.spacing(1),
            '&.Mui-disabled': {
              color: theme.palette.text.secondary
            }
          }}>
          <InfoIcon />
        </IconButton>
        <Popover
          id='popover-info'
          elevation={0}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableRestoreFocus
        >
          {/* <IconButton aria-label="Close"
            sx={{
              position: "absolute",
              top: theme.spacing(1) / 2,
              right: theme.spacing(1) / 2,
              color: "#fff"
            }}
            onClick={handleClose}>
            <ClearIcon />
          </IconButton> */}
          {children}
        </Popover>
      </span>
  );
}