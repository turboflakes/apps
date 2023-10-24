import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Typography } from '@mui/material';

const sizes = {
  sm: 32,
  lg: 64
}

export default function WeightIconButton({value, size = 'sm', selected, onClick, showDark}) {
  const theme = useTheme();
  
  return (
    <IconButton disableRipple sx={{ 
      width: sizes[size], 
      height: sizes[size], 
      // mr: size === "lg" ? theme.spacing(2) : 0,
      border: showDark ? `1px solid ${theme.palette.text.secondary}` : `1px solid ${theme.palette.text.primary}`, 
      borderRadius: '50%',
      backgroundColor: (showDark && selected) ? theme.palette.secondary.main : `rgba(11, 19, 23, ${(value + 1) * ((100/6)/100)})`,
      '&:hover': {
        backgroundColor: showDark ? theme.palette.neutrals[300] : theme.palette.neutrals[300],
      }
    }} 
    onClick={(evt) => onClick(evt, value)}
      aria-label={`weight ${value}`} color="secondary">
        {selected && value !== 0 ? 
          <CheckIcon sx={{ color: showDark ? theme.palette.text.primary : theme.palette.text.secondary }} /> : 
          (selected && value === 0 ? <ClearIcon sx={{ color: showDark ? theme.palette.text.primary : theme.palette.text.secondary }} /> : 
          <Typography variant={size === "lg" ? 'body1' : 'caption'} 
            style={{ 
              color: theme.palette.text.secondary, display: "inline-block",
             }}>
              {value}
          </Typography>)}
    </IconButton>
  );
}