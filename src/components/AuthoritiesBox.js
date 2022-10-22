import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GradeDescription from './GradeDescription';
import {
  selectFinalizedBlock,
} from '../features/api/blocksSlice';
import { 
  selectSessionCurrent,
 } from '../features/api/sessionsSlice'

export default function AuthoritiesBox({dark}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
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
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>Authorities</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{!isUndefined(block.stats.na) ? block.stats.na : '-'}</Typography>
          </Box>
          <Typography sx={{ml: 1, mr: 1}} variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{'//'}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
            <Typography variant="caption" color={dark ? theme.palette.text.secondary : 'default'}>Para-Authorities</Typography>
            <Typography variant="h5" color={dark ? theme.palette.text.secondary : theme.palette.text.primary}>{!isUndefined(block.stats.npa) ? block.stats.npa : '-'}</Typography>
          </Box>
        </Box>
        <GradeDescription sessionIndex={currentSession} poor short />
      </Box>
      {/* <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Para-Authorities</Typography>
        <Typography variant="h5">
          {!isUndefined(block.stats.na) ? block.stats.npa : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          <GradeDescription sessionIndex={currentSession} poor short />
        </Typography>
      </Box> */}
    </Paper>
  );
}