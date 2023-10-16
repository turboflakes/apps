import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
// import NotApplicapleIcon from '@mui/icons-material/NotInterested';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {
  selectChain,
} from '../../features/chain/chainSlice';

export default function WeightIconButton({value, selected, onClick}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  
  return (
    <IconButton disableRipple sx={{ 
      width: 34, 
      height: 34, 
      // display: value > 0 ? 'flex' : null, 
      // flexWrap: value > 0 ? 'wrap' : null,
      // justifyContent: 'center',
      // alignItems: 'center',
      border: `1px solid ${theme.palette.divider}`, 
      borderRadius: '50%',
      backgroundColor: `rgba(11, 19, 23, ${(value) / 10})`,
      '&:hover': {
        backgroundColor: "#4D4D4D",
      }
    }} 
    onClick={(evt) => onClick(evt, value)}
      aria-label={`weight ${value}`} color="secondary">
        {selected && value !== 0 ? 
          <CheckIcon sx={{ color: "#FFF" }} /> : 
          (selected && value === 0 ? <ClearIcon sx={{ color: '#000' }} /> : null)}
    </IconButton>
  );
}