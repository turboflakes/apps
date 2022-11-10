import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import {
  selectFinalizedBlock,
} from '../features/api/blocksSlice';
import { 
  selectSessionCurrent,
 } from '../features/api/sessionsSlice';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice';

import { grade } from '../util/grade';

export default function AuthoritiesBox({sessionIndex, dark}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const block = useSelector(selectFinalizedBlock);
  const mvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (isUndefined(block) || isUndefined(block.stats) || !mvrs.length) {
    return null
  }

  const poorGrades = mvrs.filter(mvr => grade(1 - mvr) === "F");
  const pgPercentage = poorGrades.length * 100 / mvrs.length;

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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>para-authorities</Typography>
        <Typography variant="h5">
          {!isUndefined(block.stats.npa) ? block.stats.npa : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {!isUndefined(block.stats.na) ? `${block.stats.na} authorities` : '-'}
        </Typography>
      </Box>
      {poorGrades.length > 0 ?
        <Box sx={{px: 1, display: 'flex', flexDirection: 'column',  alignItems: 'flex-end', justifyContent: 'flex-start'}}>
          <Typography variant="caption" color={theme.palette.semantics.red}>
            needs attention
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            <Box sx={{width: '16px'}}>
              <Box sx={{ 
                animation: "pulse 1s infinite ease-in-out alternate",
                borderRadius: '50%',
                boxShadow: 'rgba(223, 35, 38, 0.8) 0px 0px 16px'
              }}>
                <Box sx={{ 
                  width: '16px', height: '16px', 
                  bgcolor: theme.palette.semantics.red,
                  borderRadius: '50%',
                  textAlign: 'center',
                  }} >
                </Box>
              </Box>
            </Box>
            <Typography sx={{ ml: 1 }} variant="h5" color={theme.palette.semantics.red} >
              {poorGrades.length}
            </Typography>
          </Box>
          <Typography variant="subtitle2" color={theme.palette.semantics.red}>
            {`${pgPercentage}%` }
          </Typography>
        </Box> : null}
    </Paper>
  );
}