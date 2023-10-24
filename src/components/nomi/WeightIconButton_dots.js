import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import NotApplicapleIcon from '@mui/icons-material/NotInterested';

export default function WeightIconButton({value}) {
  const theme = useTheme();
  
  let values = Array.from({length:value},(v,k)=>k+1)
  
  return (
    <IconButton sx={{ 
      width: 34, 
      height: 34, 
      display: value > 0 ? 'flex' : null, 
      flexWrap: value > 0 ? 'wrap' : null,
      justifyContent: 'center',
      border: `1px solid ${theme.palette.divider}`, 
      borderRadius: '50%',}} 
      aria-label={`weight ${value}`} color="secondary">
        { value === 0 ?
          <NotApplicapleIcon />
          : values.map((v) => (
            <span key={v} style={{ width: '4px', height: '4px', borderRadius: '50%', margin: 0.5,
              backgroundColor: theme.palette.secondary.main, 
              display: "inline-block" }}>
            </span>
        ))
        }
    </IconButton>
  );
}