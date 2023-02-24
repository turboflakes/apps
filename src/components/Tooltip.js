import * as React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, bgcolor }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.grey[400],
  },
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.text.primary,
    backgroundColor: bgcolor ? bgcolor : theme.palette.grey[100],
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
  },
}));

export default CustomTooltip;