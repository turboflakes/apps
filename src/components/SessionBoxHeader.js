import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Typography } from '@mui/material';
import { 
  useGetBlockQuery,
  selectBestBlock,
  selectFinalizedBlock
 } from '../features/api/blocksSlice'
import { 
  useGetSessionByIndexQuery,
  selectSessionByIndex,
  selectSessionCurrent
 } from '../features/api/sessionsSlice'
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';
import { borderRadius } from '@mui/system';

export default function SessionBoxHeader({dark}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const {
    isSuccess: isFinalizedBlockSuccess,
    isFetching: isFetchingFinalizedBlock} = useGetBlockQuery({blockId: "finalized", show_stats: true}, {refetchOnMountOrArgChange: true});
  const {
    isSuccess: isBestBlockSuccess,
    isFetching: isFetchingBlockSuccess} = useGetBlockQuery({blockId: "best"}, {refetchOnMountOrArgChange: true});
  const {
    isSuccess: isSessionSuccess,
    isFetching: isFetchingSession } = useGetSessionByIndexQuery({index: currentSession});
  const best = useSelector(selectBestBlock)
  const finalized = useSelector(selectFinalizedBlock)
  const session = useSelector(state => selectSessionByIndex(state, currentSession))
  const isLiveMode = useSelector(selectIsLiveMode)
  if (isFetchingFinalizedBlock || isFetchingBlockSuccess || isFetchingSession
     || isUndefined(session) || isUndefined(best) || isUndefined(finalized)) {
      return (<Skeleton variant="rounded" sx={{
        minWidth: 400,
        height: 8,
        bgcolor: theme.palette.grey[100],
        borderRadius: 3
      }} />)
  }

  if (!isFinalizedBlockSuccess || !isBestBlockSuccess || 
    !isSessionSuccess) {
    return null
  }

  const diff = (isLiveMode ? finalized.block_number - session.sbix : session.ebix - session.sbix) + 1;
  
  return (
    <Box
      sx={{
        mx: 2,
        display: 'flex',
        alignItems: 'center'
      }}
      >
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption1" color={dark ? theme.palette.text.secondary : 'default'}>era</Typography>
            <Typography variant="h6" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? `${session.eix.format()}` : '-'}</Typography>
          </Box>
          {/* <Typography sx={{ml: 1, mr: 1}} variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{'//'}</Typography> */}
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption1" color={dark ? theme.palette.text.secondary : 'default'}>session</Typography>
            <Typography variant="h6" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? `${session.six.format()}` : '-'}</Typography>
          </Box>
          <Box sx={{ mx: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption1" color={dark ? theme.palette.text.secondary : 'default'}>best block</Typography>
            <Typography variant="h6" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isBestBlockSuccess ? `#${best.block_number.format()}` : '-'}</Typography>
          </Box>
          <Box sx={{ mx: 2,  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption1" color={dark ? theme.palette.text.secondary : 'default'}>finalized block</Typography>
            <Typography variant="h6" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isFinalizedBlockSuccess ? `#${finalized.block_number.format()}` : '-'}</Typography>
          </Box>
        {/* </Box> */}
        {/* {isLiveMode ?
          <Typography variant="subtitle3" color={dark ? theme.palette.text.secondary : 'default'}>{isFinalizedBlockSuccess ? `${diff.format()} finalized blocks since block #${session.sbix.format()}` : `-`}</Typography> : 
          <Typography variant="subtitle3" color={dark ? theme.palette.text.secondary : 'default'}>{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
        } */}
      {/* </Box> */}
    </Box>
  );
}