import * as React from 'react';
import { useSelector } from 'react-redux'
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'
import { 
  selectSessionCurrent,
  selectSessionByIndex,
 } from '../features/api/sessionsSlice'


export default function BlockFinalizedBox() {
  const {isSuccess} = useGetBlockQuery("finalized");
  const blocks = useSelector(selectAll)
  const currentSession = useSelector(selectSessionCurrent);
  const session = useSelector(state => selectSessionByIndex(state, currentSession))
  
  if (!isSuccess || isUndefined(session)) {
    return null
  }

  const block = blocks[blocks.length-1]
  const diff = block.bix - session.sbix

  return (
    <Paper
      sx={{
        p: `16px 24px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ width: '50%', display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap'  }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">Finalized block</Typography>
          <Typography variant="h5">{isSuccess ? `# ${block.bix.format()}` : '-'}</Typography>
          <Typography variant="subtitle2">{isSuccess ? `${diff.format()} blocks since #${session.sbix.format()}` : `-`}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}