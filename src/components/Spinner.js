import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';

export default function Spinner(props) {
  return (
    <Box sx={{ position: 'relative', width: props.size, height: props.size }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 600],
        }}
        size={props.size}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => 
            (theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.primary.main),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={props.size}
        thickness={4}
        {...props}
      />
    </Box>
  );
}