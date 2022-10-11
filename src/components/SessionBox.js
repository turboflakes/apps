import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectAll,
 } from '../features/api/blocksSlice'
import { 
  useGetSessionByIndexQuery,
  selectSessionByIndex,
 } from '../features/api/sessionsSlice'
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';

export default function SessionBox({sessionIndex, dark}) {
  const theme = useTheme();
  const {isSuccess: isBlockSuccess} = useGetBlockQuery("finalized");
  const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex);
  const blocks = useSelector(selectAll)
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  const isLiveMode = useSelector(selectIsLiveMode)
  
  if (!isBlockSuccess || !isSessionSuccess || isUndefined(session)) {
    return null
  }

  const block = blocks[blocks.length-1];
  const diff = isLiveMode ? block.bix - session.sbix : session.ebix - session.sbix;
  
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: dark ? theme.palette.background.secondary : theme.palette.neutrals[100]
      }}
      >
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>era</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? session.eix.format() : '-'}</Typography>
          </Box>
          <Typography sx={{ml: 1, mr: 1}} variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{'//'}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>session</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? session.six.format() : '-'}</Typography>
          </Box>
        </Box>
        {isLiveMode ?
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : 'default'}>{isBlockSuccess ? `${diff.format()} finalized blocks since #${session.sbix.format()}` : `-`}</Typography> : 
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : 'default'}>{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
        }
      </Box>
      {isLiveMode ? 
        <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
          <Typography variant="caption" align='right' color={dark ? theme.palette.text.secondary : 'default'}>finalized block</Typography>
          <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isBlockSuccess ? `# ${block.bix.format()}` : '-'}</Typography>
        </Box> : null}
    </Paper>
  );
}