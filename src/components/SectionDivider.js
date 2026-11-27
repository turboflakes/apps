import * as React from 'react';
import Divider from '@mui/material/Divider';

export default function SectionDivider({ dark = false, sx = {} }) {
  const rgb = dark ? "255, 255, 255" : "0, 0, 0";
  return (
    <Divider sx={{
      opacity: 0.25,
      height: '1px',
      borderTop: '0px solid rgba(0, 0, 0, 0.08)',
      borderBottom: 'none',
      backgroundColor: 'transparent',
      backgroundImage: `linear-gradient(to right, rgba(${rgb}, 0), rgba(${rgb}, 0.5), rgba(${rgb}, 0))`,
      ...sx,
      }} />
  );
}
