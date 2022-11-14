import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme, styled } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import {
  selectFinalizedBlock,
} from '../features/api/blocksSlice';
import { 
  selectMVRsBySession
 } from '../features/api/sessionsSlice';

import { grade } from '../util/grade';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'transparent',
    padding: 0,
  },
}));

const customTitle = (data, theme) => {
  return (
    <Box
        sx={{ 
          bgcolor: theme.palette.semantics.red,
          p: 2,
          m: 0,
          borderRadius: 1,
          minWidth: '144px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography variant="h6" color="textSecondary">
          <b>{data.value} validators need attention!</b>
        </Typography>
        <Typography component="div" variant="caption" color="textSecondary" gutterBottom>
          <span style={{color: theme.palette.text.primary }}></span>MVR average: <b>{data.average}</b>
        </Typography>
      </Box>
  )
}

export default function AuthoritiesBox({sessionIndex, dark}) {
  const theme = useTheme();
  const block = useSelector(selectFinalizedBlock);
  const rawMvrs = useSelector(state => selectMVRsBySession(state, sessionIndex));
  
  if (!rawMvrs.length) {
    return null
  }
  
  const mvrs = rawMvrs.filter(mvr => !isUndefined(mvr) && !isNull(mvr))

  if (!mvrs.length) {
    return null
  }

  if (isUndefined(block) || isUndefined(block.stats) || !mvrs.length) {
    return null
  }

  const poorGrades = mvrs.filter(mvr => grade(1 - mvr) === "F");
  const pgAverage = Math.round((poorGrades.reduce((a, b) => a + b, 0) / poorGrades.length) * 10000) / 10000;
  const pgPercentage = poorGrades.length * 100 / mvrs.length;
  const tooltipData = {value: poorGrades.length, percentage: pgPercentage, average: pgAverage, session: sessionIndex};

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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>active validators</Typography>
        <Typography variant="h5">
          {!isUndefined(block.stats.npa) ? block.stats.na : '-'}
        </Typography>
        <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
          {!isUndefined(block.stats.npa) ? `${block.stats.npa} para-authorities` : '-'}
        </Typography>
      </Box>
      {poorGrades.length > 0 ?
        <Box sx={{px: 1, display: 'flex', flexDirection: 'column',  alignItems: 'flex-end', justifyContent: 'flex-start'}}>
          {/* <Typography variant="caption" color={theme.palette.semantics.red}>
            needs attention
          </Typography> */}
          <CustomTooltip
            disableFocusListener
            placement="bottom-start"
            title={customTitle(tooltipData, theme)}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }} >
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
          </CustomTooltip>
          {/* <Typography variant="subtitle2" color={theme.palette.semantics.red}>
            {`${pgPercentage}%` }
          </Typography> */}
        </Box> : null}
    </Paper>
  );
}