import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  selectFinalizedBlock,
} from '../features/api/blocksSlice';

export default function AuthoredBlocksBox() {
  // const theme = useTheme();
  const block = useSelector(selectFinalizedBlock);
  
  if (isUndefined(block) || isUndefined(block.stats)) {
    return null
  }

  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>authored blocks</Typography>
        <Typography variant="h5">
          {!isUndefined(block.stats.ab) ? block.stats.ab : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {`last #${block.block_number.format()}`}
        </Typography>
      </Box>
    </Paper>
  );
}