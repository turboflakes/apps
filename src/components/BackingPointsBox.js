import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { BarChart, Bar, Tooltip as ChartTooltip } from 'recharts';
import {
  selectFinalizedBlock,
  selectBlockById,
} from '../features/api/blocksSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  getBlocksPerSessionTarget
} from '../constants';

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
          minWidth: '368px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit">
          <b>Backing Points</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit" paragraph>
          <i>Session {data.session.format()}</i>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>❚</span>At block #{data.currentBlock.format()}: <b>{data.value.format()}</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>❚</span>At block #{data.previousBlock.format()} (previous session): <b>{data.previous.format()}</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function BackingPointsBox() {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const block = useSelector(selectFinalizedBlock);
  const selectedChain = useSelector(selectChain);
  const nBlocksTarget = getBlocksPerSessionTarget(selectedChain);
  const previousBlock = useSelector(state => selectBlockById(state, !isUndefined(block) ? block.block_number - nBlocksTarget : 0));
  
  if (isUndefined(currentSession) || currentSession === "current" || 
    isUndefined(block) || isUndefined(block.stats)) {
    return null
  }

  const backingPoints = block.stats.pt - (block.stats.ab * 20);
  const previousBackingPoints = !isUndefined(previousBlock) ? (previousBlock.stats.pt - (previousBlock.stats.ab * 20)) : undefined;
  const diff = !isUndefined(previousBackingPoints) ? Math.round(((backingPoints * 100 / previousBackingPoints) - 100) * 10) / 10 : 0;

  const data = !isUndefined(previousBackingPoints) ? [
    {value: backingPoints, currentBlock: block.block_number, previous: previousBackingPoints, previousBlock: previousBlock.block_number, session: currentSession},
  ] : [];

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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>backing points</Typography>
        <Typography variant="h5">
          {backingPoints.format()}
        </Typography>
        <Tooltip title={`${Math.abs(diff)}% ${Math.sign(diff) > 0 ? 'more' : 'less'} than the average of Backing Points collected by all Para-Authorities in the current session.`} arrow>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', 
            lineHeight: 0.875,
            color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}>
            <b style={{whiteSpace: 'pre'}}>{diff !== 0 ? (Math.sign(diff) > 0 ? `+${diff}%` : `-${Math.abs(diff)}%`) : ' '}</b>
          </Typography>
        </Tooltip>
      </Box>
      <Box sx={{ px: 1, width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <BarChart width={64} height={64}
          data={data}
          margin={{
            top: 4,
            right: 0,
            left: 0,
            bottom: 4,
          }}>
          <Bar dataKey="value" barSize={12} fill={theme.palette.text.primary} />
          <Bar dataKey="previous" barSize={12} fill={theme.palette.grey[200]} />
          <ChartTooltip 
                cursor={{fill: 'transparent'}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
        </BarChart>
      </Box>
    </Paper>
  );
}