import * as React from 'react';
import Divider from '@mui/material/Divider';

export default function SectionDivider() {
  return (
    <Divider sx={{ 
      // my: 2,
      opacity: 0.25,
      height: '1px',
      borderTop: '0px solid rgba(0, 0, 0, 0.08)',
      borderBottom: 'none',
      backgroundColor: 'transparent',
      backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
      }} />
  );
}