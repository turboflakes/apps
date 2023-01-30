import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import { BarChart, Bar, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
import {
  selectValGroupValidityVotesBySessionAndGroupId,
  selectValidatorIdsBySessionAndGroupId
} from '../features/api/valGroupsSlice';
import {
  selectValidityVotesBySession
} from '../features/api/sessionsSlice';

const renderTooltip = (props, theme) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          minWidth: '230px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" paragraph>
        <b>Validity Statements</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>Val. Group {data.groupId}: <b>{data.value}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>All Val. Groups (avg): <b>{data.avg}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValGroupValidityVotesBox({groupId, sessionIndex}) {
  const theme = useTheme();
  // fetch history summary for all validators in the selected history session
  const {isFetching} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true});
  const _validityVotes = useSelector(state => selectValGroupValidityVotesBySessionAndGroupId(state, sessionIndex,  groupId));
  const validatorIds = useSelector(state => selectValidatorIdsBySessionAndGroupId(state, sessionIndex,  groupId));
  const allValidityVotes = useSelector(state => selectValidityVotesBySession(state, sessionIndex));
  
  if (isFetching || validatorIds.length === 0) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }
  
  const validityVotes = _validityVotes / validatorIds.length;
  const avg = Math.round((!!allValidityVotes.length ? allValidityVotes.reduce((a, b) => a + b, 0) / allValidityVotes.length : 0) * 100) / 100;
  const diff = !!avg ? Math.round(((validityVotes * 100 / avg) - 100) * 10) / 10 : 0;

  const data = [
    {name: 'Validity votes', value: validityVotes, avg, groupId},
  ];
  
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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>validity statements (x̅)</Typography>
        <Typography variant="h4">
          {validityVotes}
        </Typography>
        <Tooltip title={`${Math.abs(diff)}% ${diff !== 0 ? (Math.sign(diff) > 0 ? `more` : `less`) : ''} than the average of validity votes from all Para-Authorities in the current session.`} arrow>
          <Typography variant="subtitle2" sx={{
            lineHeight: 0.875,
            whiteSpace: 'nowrap', color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red
            }}>
            <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${diff}%` : `-${Math.abs(diff)}%`) : ' '}</b>
          </Typography>
        </Tooltip>
      </Box>
      <ResponsiveContainer width='40%' height='100%'>
        <BarChart data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 10,
          }}>
          <Bar dataKey="value" barSize={12} fill={theme.palette.text.primary} />
          <Bar dataKey="avg" barSize={12} fill={theme.palette.grey[200]} />
          <ChartTooltip 
                cursor={{fill: 'transparent'}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}