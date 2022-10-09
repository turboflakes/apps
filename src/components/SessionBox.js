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
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';

export default function SessionBox({sessionIndex, address, dark}) {
  const theme = useTheme();
  const {isSuccess: isBlockSuccess} = useGetBlockQuery("finalized");
  const {isSuccess: isSessionSuccess } = useGetSessionByIndexQuery(sessionIndex);
  const blocks = useSelector(selectAll)
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex))
  const isLiveMode = useSelector(selectIsLiveMode)
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))

  if (!isBlockSuccess || !isSessionSuccess || isUndefined(session)) {
    return null
  }

  const block = blocks[blocks.length-1];
  const diff = isLiveMode ? block.bix - session.sbix : session.ebix - session.sbix;

  const status = isUndefined(validator) ? '' : (validator.is_auth && validator.is_para ? 'Para-Authority' : (validator.is_auth ? 'Authority' : 'Not Authority'));
  
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
        bgcolor: dark ? theme.palette.background.secondary : theme.palette.background.primary
      }}
      >
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>era</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? session.eix.format() : '-'}</Typography>
          </Box>
          <Typography sx={{ml: 1, mr: 1}} variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{'//'}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>session</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isSessionSuccess ? session.six.format() : '-'}</Typography>
          </Box>
        </Box>
        {isLiveMode ?
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{isBlockSuccess ? `${diff.format()} finalized blocks since #${session.sbix.format()}` : `-`}</Typography> : 
          <Typography variant="subtitle2" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{`${diff.format()} blocks from #${session.sbix.format()} to #${session.ebix.format()}`}</Typography>
        }
      </Box>
      <Divider orientation="vertical" 
        sx={{
          borderColor: dark ? theme.palette.background.primary : theme.palette.background.secondary,
          opacity: 0.64
        }}/>
      <Box sx={{ pl: 1, pr: 1, minWidth: '192px',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
        <Typography variant="caption" align='right' color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>status</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{status}</Typography>
      </Box>
    </Paper>
  );
}