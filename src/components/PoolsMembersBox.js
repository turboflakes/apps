import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme, styled } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import uniq from 'lodash/uniq';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import {
  selectChain,
} from '../features/chain/chainSlice';
import { 
  selectTotalMembersBySession
 } from '../features/api/poolsSlice';
import { 
  getSessionsPerDayTarget 
} from '../constants'

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
        <Typography variant="h6" color="textSecondary" gutterBottom>
          <b>Some validators need attention!</b>
        </Typography>
        <Typography component="div" variant="caption" color="textSecondary" gutterBottom>
          <span style={{color: theme.palette.text.primary }}></span>Grade F: <b>{data.fGrades}</b>
        </Typography>
        <Typography component="div" variant="caption" color="textSecondary" gutterBottom>
          <span style={{color: theme.palette.text.primary }}></span>Disputes: <b>{data.disputes}</b>
        </Typography>
      </Box>
  )
}

const emptyBox = ({theme, dark}) => {
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
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: dark ? theme.palette.background.secondary : 'default'
    }} />
  )
}

export default function PoolMembersBox({sessionIndex, isFetching, dark}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const nSessionsTarget = getSessionsPerDayTarget(selectedChain);
  const currentMembers = useSelector(state => selectTotalMembersBySession(state, sessionIndex));
  const previousMembers = useSelector(state => selectTotalMembersBySession(state, sessionIndex - nSessionsTarget));

  console.log("__previousMembers", nSessionsTarget, previousMembers);
  
  const diff = !isUndefined(previousMembers) ? currentMembers - previousMembers : 0;

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
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        bgcolor: dark ? theme.palette.background.secondary : 'default'
      }}>
      <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}
          color={dark ? theme.palette.text.secondary : 'default'}>total members</Typography>
        <Typography variant="h5" color={dark ? theme.palette.text.secondary : 'default'}>
          {currentMembers}
        </Typography>
        <Tooltip title={`${Math.abs(diff)}% ${Math.sign(diff) > 0 ? 'more' : 'less'} than 24 sessions ago.`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', 
            lineHeight: 0.875,
            color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}>
            <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${diff}` : `-${Math.abs(diff)}`) : ' '}</b>
          </Typography>
        </Tooltip>
      </Box>
    </Paper>
  );
}